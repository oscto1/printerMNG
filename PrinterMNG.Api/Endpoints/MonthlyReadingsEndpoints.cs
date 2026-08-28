using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Authorization;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos.MonthlyReadings;
using PrinterMNG.Api.Models;

namespace PrinterMNG.Api.Endpoints;

public static class MonthlyReadingsEndpoints
{
    const string GetMonthlyReadingEndpointName = "GetMonthlyReading";
    public static void MapMonthlyReadingsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("monthly-readings");

        group.MapGet("/{id}", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var reading = await dbContext.MonthlyReadings.FirstOrDefaultAsync(mr => mr.Id == id && mr.Contract.Client.AdminId == userId);

            if(reading is null)
            {
                return Results.NotFound();
            }
            
            ReadingSummaryDto readingRes = new(
                reading.Id,
                reading.ContractId,
                reading.Month,
                reading.BlackCounter,
                reading.ColorCounter,
                reading.BlackCopiesUsed,
                reading.ColorCopiesUsed,
                reading.BlackCharge,
                reading.ColorCharge,
                reading.TotalCharge,
                reading.Notes
            );

            return Results.Ok(readingRes);

        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin))
        .WithName(GetMonthlyReadingEndpointName);


        group.MapPost("/", async (CreateReadingDto newReading, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var contract = await dbContext.Contracts
                .Include(contract => contract.Printer)
                .Where(contract => contract.Id == newReading.ContractId && contract.Client.AdminId == userId)
                .FirstOrDefaultAsync();

            if(contract is not null)
            {
                if(!contract.IsActive)
                {
                    return Results.Conflict(new { errors = "CONTRACT_NOT_ACTIVE" });
                }

                int readingsCount = await dbContext.MonthlyReadings.AsNoTracking().CountAsync(mr => mr.ContractId == contract.Id);

                // Limit of readings per contract
                if(readingsCount >= 50)
                {
                    return Results.Conflict(new { errors = "READINGS_LIMIT_REACHED" });
                }

                DateOnly newMonth = DateOnly.ParseExact($"{newReading.Month}-01", "yyyy-MM-dd");

                var prevReading = await dbContext.MonthlyReadings
                                                    .Where(prev => prev.ContractId == contract.Id)
                                                    .AsNoTracking()
                                                    .OrderByDescending(prev => prev.Month)
                                                    .FirstOrDefaultAsync();
                                                    
                int blackCounter = newReading.BlackCounter;
                int colorCounter = newReading.ColorCounter;
                int blackCopiesUsed = 0;
                int colorCopiesUsed = 0;
                decimal blackCharge = 0;
                decimal colorCharge = 0;
                decimal totalCharge = 0;

                colorCounter = contract.Printer.IsColorPrinter ? colorCounter : 0;
                if(prevReading is not null)
                {
                    if(blackCounter < prevReading.BlackCounter)
                    {
                        // return Results.BadRequest("Black counter cannot be lower than previous reading.");
                        return Results.BadRequest(new { errors = "BLACK_COUNTER_READING_INVALID" });
                    }
                    // blackCounter = prevReading.BlackCounter;
                    
                    if(colorCounter < prevReading.ColorCounter)
                    {
                        // return Results.BadRequest("Color counter cannot be lower than previous reading.");
                        return Results.BadRequest(new { errors = "COLOR_COUNTER_READING_INVALID" });
                    }
                    // colorCounter = prevReading.ColorCounter;
                    
                    if(newMonth <= prevReading.Month)
                    {
                        // return Results.BadRequest("Cannot create a reading with a date previous to the last one.");
                        return Results.BadRequest(new { errors = "DATE_READING_INVALID" });
                    }

                    blackCopiesUsed = blackCounter - prevReading.BlackCounter;
                    colorCopiesUsed = colorCounter - prevReading.ColorCounter;
                }

                blackCharge = blackCopiesUsed * contract.BlackCopyPrice;
                colorCharge = colorCopiesUsed * contract.ColorCopyPrice;

                totalCharge = blackCharge + colorCharge;

                MonthlyReading reading = new()
                {
                    ContractId = newReading.ContractId,
                    Month = newMonth,
                    BlackCounter = blackCounter,
                    ColorCounter = colorCounter,
                    BlackCopiesUsed = blackCopiesUsed,
                    ColorCopiesUsed = colorCopiesUsed,
                    BlackCharge = blackCharge,
                    ColorCharge = colorCharge,
                    TotalCharge = ((totalCharge > contract.MinimumCharge) || prevReading is null) ? totalCharge : contract.MinimumCharge,
                    Notes = newReading.Notes,
                    CreatedAt = DateTime.UtcNow,
                };

                dbContext.MonthlyReadings.Add(reading);
                await dbContext.SaveChangesAsync();

                return Results.CreatedAtRoute(GetMonthlyReadingEndpointName, new { id = reading.Id });
            }
            else
            {
                // return Results.BadRequest("The contract with the given id doesn't exist!");
                return Results.BadRequest(new { errors= "CONTRACT_NOT_FOUND" });
            }
            // return Results.CreatedAtRoute(GetContractEndpointName, new { id = contract.Id });
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));
    }
}