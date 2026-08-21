using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using PrinterMNG.Api.Authorization;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos.Contracts;
using PrinterMNG.Api.Dtos.MonthlyReadings;
using PrinterMNG.Api.Models;

namespace PrinterMNG.Api.Endpoints;

public static class ContractsEndpoints
{
    const string GetContractEndpointName = "GetContract";
    public static void MapContractsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/contracts");
 
        // GET /contracts/
        group.MapGet("/", async (PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            return await dbContext.Contracts
                    .Include(contract => contract.Printer)
                    .Where(contract => contract.Client.AdminId == userId)
                    .Include(contract => contract.Client)
                    .Select(contract => new ContractSummaryDto(
                        contract.Id,
                        contract.Client.Id,
                        contract.Client.Name,
                        contract.Printer.Model,
                        null,
                        contract.Printer.IsColorPrinter,
                        contract.IsActive,
                        contract.BlackCopyPrice,
                        contract.ColorCopyPrice,
                        contract.MinimumCharge,
                        contract.StartDate,
                        contract.BillDay
                    ))
                    .AsNoTracking()
                    .ToListAsync();
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));

        // GET /contracts/1
        group.MapGet("/{id}", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var contr = await dbContext.Contracts
                .Include(contract => contract.Client)
                .Include(contract => contract.Printer)
                .Where(contract => contract.Id == id && contract.Client.AdminId == userId)
                .FirstOrDefaultAsync();

            if(contr is not null)
            {
                return Results.Ok(new ContractSummaryDto(
                    contr.Id,
                    contr.Client.Id,
                    contr.Client.Name,
                    contr.Printer.Model,
                    contr.ContractPdfPath,
                    contr.Printer.IsColorPrinter,
                    contr.IsActive,
                    contr.BlackCopyPrice,
                    contr.ColorCopyPrice,
                    contr.MinimumCharge,
                    contr.StartDate,
                    contr.BillDay
                ));
            }

            return Results.NotFound();
            
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin))
        .WithName(GetContractEndpointName);

        // POST /contracts/
        group.MapPost("/", async (CreateContractDto newContract, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isClientOwner = await dbContext.Clients.AnyAsync(c => c.AdminId == userId && c.Id == newContract.ClientId);

            if(!isClientOwner)
            {
                return Results.BadRequest(new {errors = "CLIENT_NOT_FOUND"});
            }

            var printer = await dbContext.Printers.FirstOrDefaultAsync(p => p.Id == newContract.PrinterId && p.AdminId == userId);

            if(printer is null)
            {
                return Results.BadRequest(new {errors = "PRINTER_NOT_FOUND"});
            }

            decimal colorCopyPrice = 0;
            if(printer is not null && printer.IsColorPrinter)
            {
                colorCopyPrice = newContract.ColorCopyPrice;
            }

            Contract contract = new()
            {
                IsActive = true,
                ClientId = newContract.ClientId,
                PrinterId = newContract.PrinterId,
                BlackCopyPrice = newContract.BlackCopyPrice,
                ColorCopyPrice = colorCopyPrice,
                MinimumCharge = newContract.MinimumCharge,
                StartDate = newContract.StartDate,
                BillDay = newContract.BillDay
            };

            dbContext.Contracts.Add(contract);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetContractEndpointName, new { id = contract.Id });
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));

        // PUT /contracts/1
        group.MapPut("/{id}", async (int id, UpdateContractDto newContract, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var contract = await dbContext.Contracts.FirstOrDefaultAsync(c => c.Client.AdminId == userId && c.Id == id);

            if(contract is null)
            {
                return Results.NotFound();
            }

            bool isClientOwner = await dbContext.Clients.AnyAsync(c => c.AdminId == userId && c.Id == newContract.ClientId);
            
            if(!isClientOwner)
            {
                return Results.BadRequest(new {errors = "CLIENT_NOT_FOUND"});
            }

            var printer = await dbContext.Printers.FirstOrDefaultAsync(p => p.Id == newContract.PrinterId && p.AdminId == userId);

            if(printer is null)
            {
                return Results.BadRequest(new {errors = "PRINTER_NOT_FOUND"});
            }

            decimal colorCopyPrice = 0;
            if(printer is not null && printer.IsColorPrinter)
            {
                colorCopyPrice = newContract.ColorCopyPrice;
            }

            contract.ClientId = newContract.ClientId;
            contract.PrinterId = newContract.PrinterId;
            contract.IsActive = newContract.IsActive;
            contract.BlackCopyPrice = newContract.BlackCopyPrice;
            contract.ColorCopyPrice = colorCopyPrice;
            contract.MinimumCharge = newContract.MinimumCharge;
            contract.StartDate = newContract.StartDate;
            contract.BillDay = newContract.BillDay;
            contract.EndDate = newContract.EndDate;

            await dbContext.SaveChangesAsync();
            
            return Results.NoContent();
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));


        // DELETE /contracts/1
        group.MapDelete("/{id}", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            await dbContext.Contracts.Where(contract => contract.Id == id && contract.Client.AdminId == userId).ExecuteDeleteAsync();
            return Results.NoContent();
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));


        // Readings by contract -----------------------------------------------------------
        // GET /contracts/1/readings
        group.MapGet("/{id}/readings", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var readings = await dbContext.MonthlyReadings
                                            .Where(reading => reading.ContractId == id && reading.Contract.Client.AdminId == userId)
                                            .OrderByDescending(reading => reading.Month)
                                            .Select(reading => new ReadingSummaryDto(
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
                                            ))
                                            // .OrderByDescending(reading => reading.Month)
                                            .AsNoTracking()
                                            .ToListAsync();

            return Results.Ok(readings);
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));


        // DELETE /contracts/1/readings/1
        group.MapDelete("{id}/readings/{idRead}", async (int id, int idRead, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var contract = await dbContext.Contracts
                .Where(contract => contract.Id == id && contract.Client.AdminId == userId)
                .Include(contract => contract.Printer)
                .FirstOrDefaultAsync();

            if (contract is null)
            {
                return Results.BadRequest(new { errors = "CONTRACT_NOT_FOUND" });
            }

            if (contract is not null && !contract.IsActive)
            {
                return Results.BadRequest(new { errors = "CONTRACT_NOT_ACTIVE" });
            }

            MonthlyReading? lastReading = null;

            if(contract is not null)
            {
                lastReading = await dbContext.MonthlyReadings
                                .Where(reading => reading.ContractId == contract.Id && reading.Contract.Client.AdminId == userId )
                                .OrderByDescending(reading => reading.Month)
                                .AsNoTracking()
                                .FirstOrDefaultAsync();

                if (lastReading is not null && lastReading.Id == idRead)
                {
                    Console.WriteLine("Somehow found a reading");
                    if (lastReading.Id == idRead)
                    {
                        await dbContext.MonthlyReadings.Where(reading => reading.Id == idRead).ExecuteDeleteAsync();
                    }
                    else
                    {
                        // return Results.BadRequest("only can delete last reading!");
                        return Results.BadRequest(new { errors = "ONLY_LAST_READING_CAN_BE_DELETED" });
                    }
                }
            }
            return Results.NoContent();
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin)); ;



        // PUT contracts/1/readings/1
        group.MapPut("/{id}/readings/{idReading}", async (int id, int idReading, UpdateReadingDto editedReading, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var contract = await dbContext.Contracts
                .Include(contract => contract.Printer)
                .Where(contract => contract.Id == id && contract.Client.AdminId == userId)
                .FirstOrDefaultAsync();

            if (contract is null)
            {
                return Results.BadRequest(new { errors = "CONTRACT_NOT_FOUND" });
            }

            if(contract is not null)
            {
                if(!contract.IsActive)
                {
                    return Results.BadRequest(new { errors = "CONTRACT_NOT_ACTIVE" });
                }
                
                MonthlyReading? lastReading = await dbContext.MonthlyReadings
                                            .Where(reading => reading.ContractId == contract.Id && reading.Contract.Client.AdminId == userId)
                                            .OrderByDescending(reading => reading.Month)
                                            .FirstOrDefaultAsync();

                MonthlyReading? previousReading = await dbContext.MonthlyReadings
                                                .Where(reading => reading.ContractId == contract.Id && reading.Contract.Client.AdminId == userId)
                                                .OrderByDescending(reading => reading.Month)
                                                .AsNoTracking()
                                                .Skip(1)
                                                .FirstOrDefaultAsync();

                if(lastReading is not null)
                {
                    if(lastReading.Id == idReading)
                    {
                        int blackCounter = editedReading.BlackCounter;
                        int colorCounter = editedReading.ColorCounter;
                        int blackCopiesUsed = 0;
                        int colorCopiesUsed = 0;
                        decimal blackCharge = 0;
                        decimal colorCharge = 0;
                        decimal totalCharge = 0;
                        DateOnly newMonth = DateOnly.ParseExact($"{editedReading.Month}-01", "yyyy-MM-dd");

                    // TODO: Test editing when there's only one reading
                        if (newMonth <= previousReading?.Month)
                        {
                            return Results.BadRequest(new { errors = "DATE_READING_INVALID" });
                        }

                        if (blackCounter < previousReading?.BlackCounter)
                        {
                            return Results.BadRequest(new { errors = "BLACK_COUNTER_READING_INVALID" });
                        }

                        if (colorCounter < previousReading?.ColorCounter)
                        {
                            return Results.BadRequest(new { errors = "COLOR_COUNTER_READING_INVALID" });
                        }

                        if(previousReading is not null) 
                        {
                            blackCopiesUsed = blackCounter - previousReading.BlackCounter;
                            colorCopiesUsed = colorCounter - previousReading.ColorCounter;
                        }
                        blackCharge = blackCopiesUsed * contract.BlackCopyPrice;
                        colorCharge = colorCopiesUsed * contract.ColorCopyPrice;

                        totalCharge = blackCharge + colorCharge;

                        if(!contract.Printer.IsColorPrinter)
                        {
                            colorCounter = 0;
                            colorCopiesUsed = 0;
                            colorCharge = 0;
                        }

                        totalCharge = blackCharge + colorCharge;


                        lastReading.Month = newMonth;
                        lastReading.BlackCounter = blackCounter;
                        lastReading.ColorCounter = colorCounter;
                        lastReading.BlackCharge = blackCharge;
                        lastReading.ColorCharge = colorCharge;
                        lastReading.TotalCharge = ((totalCharge > contract.MinimumCharge) || previousReading is null) ? totalCharge : contract.MinimumCharge;
                        lastReading.BlackCopiesUsed = blackCopiesUsed;
                        lastReading.ColorCopiesUsed = colorCopiesUsed;
                        lastReading.Notes = editedReading.Notes;
                        
                        await dbContext.SaveChangesAsync();
 
                        return Results.NoContent();

                    }
                    else
                    {
                        return Results.BadRequest(new { errors = "COULD_NOT_UPDATE_READING_IN" });
                    }
                }
            }
            else
            {
                return Results.BadRequest(new { errors = "CONTRACT_NOT_FOUND" });
            }
            
            // return Results.BadRequest("Couldn't edit the reading. Check the validity of the data");
            return Results.BadRequest(new { errors = "COULD_NOT_UPDATE_READING" });
            
  
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));
    }
}