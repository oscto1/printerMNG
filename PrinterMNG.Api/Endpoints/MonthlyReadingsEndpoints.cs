using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
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

        group.MapGet("/{id}", async (int id, PrinterMNGContext dbContext) =>
        {
            var reading = await dbContext.MonthlyReadings.FindAsync(id);

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

        }).WithName(GetMonthlyReadingEndpointName);


        group.MapPost("/", async (CreateReadingDto newReading, PrinterMNGContext dbContext) =>
        {
            var contract = await dbContext.Contracts
                .Include(contract => contract.Printer)
                .Where(contract => contract.Id == newReading.ContractId)
                .FirstOrDefaultAsync();

            if(contract is not null)
            {
                if(!contract.IsActive)
                {
                    return Results.Conflict("The contract is not active");
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

                if(prevReading is not null)
                {
                    if(blackCounter < prevReading.BlackCounter)
                    {
                        return Results.BadRequest("Black counter cannot be lower than previous reading.");
                    }
                    // blackCounter = prevReading.BlackCounter;
                    
                    if(colorCounter < prevReading.ColorCounter)
                    {
                        return Results.BadRequest("Color counter cannot be lower than previous reading.");
                    }
                    // colorCounter = prevReading.ColorCounter;
                    
                    if(newMonth <= prevReading.Month)
                    {
                        return Results.BadRequest("Cannot create a reading previous to the last one.");
                    }

                    colorCounter = contract.Printer.IsColorPrinter ? colorCounter : 0;

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
                    TotalCharge = totalCharge > contract.MinimumCharge ? totalCharge : contract.MinimumCharge,
                    Notes = newReading.Notes,
                    CreatedAt = DateTime.Now,
                };

                dbContext.MonthlyReadings.Add(reading);
                await dbContext.SaveChangesAsync();

                return Results.CreatedAtRoute(GetMonthlyReadingEndpointName, new { id = reading.Id });
            }
            else
            {
                return Results.BadRequest("The contract with the given id doesn't exist!");
            }
            // return Results.CreatedAtRoute(GetContractEndpointName, new { id = contract.Id });
        });
    }
}