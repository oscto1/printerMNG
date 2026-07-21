using System.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
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
        group.MapGet("/", async (PrinterMNGContext dbContext) =>
        {
            return await dbContext.Contracts
                    .Include(contract => contract.Printer)
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
        });

        // GET /contracts/1
        group.MapGet("/{id}", async (int id, PrinterMNGContext dbContext) =>
        {
            var contr = await dbContext.Contracts
                .Include(contract => contract.Client)
                .Include(contract => contract.Printer)
                .Where(contract => contract.Id == id)
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
            
        }).WithName(GetContractEndpointName);

        // POST /contracts/
        group.MapPost("/", async (CreateContractDto newContract, PrinterMNGContext dbContext) =>
        {
            var printer = await dbContext.Printers.FindAsync(newContract.PrinterId);

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
        });

        // PUT /contracts/1
        group.MapPut("/{id}", async (int id, UpdateContractDto newContract, PrinterMNGContext dbContext) =>
        {
            var contract = await dbContext.Contracts.FindAsync(id);
            var printer = await dbContext.Printers.FindAsync(newContract.PrinterId);

            if(contract is null)
            {
                return Results.NotFound();
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
        });


        // DELETE /contracts/1
        group.MapDelete("/{id}", async (int id, PrinterMNGContext dbContext) =>
        {
            await dbContext.Contracts.Where(contract => contract.Id == id).ExecuteDeleteAsync();
            return Results.NoContent();
        });


        // Readings by contract -----------------------------------------------------------
        // GET /contracts/1/readings
        group.MapGet("/{id}/readings", async (int id, PrinterMNGContext dbContext) =>
        {
            var readings = await dbContext.MonthlyReadings
                                            .Where(reading => reading.ContractId == id)
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
        });


        // DELETE /contracts/1/readings/1
        group.MapDelete("{id}/readings/{idRead}", async (int id, int idRead, PrinterMNGContext dbContext) =>
        {
            var contract = await dbContext.Contracts
                .Include(contract => contract.Printer)
                .Where(contract => contract.Id == id)
                .FirstOrDefaultAsync();

            if(contract is not null && !contract.IsActive)
            {
                return Results.BadRequest("The contract is not active!");
            }

            MonthlyReading? lastReading = await dbContext.MonthlyReadings
                                        .Where(reading => reading.ContractId == id)
                                        .OrderByDescending(reading => reading.Month)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();

            if(lastReading is not null)
            {
                if(lastReading.Id == idRead)
                {
                    await dbContext.MonthlyReadings.Where(reading => reading.Id == idRead).ExecuteDeleteAsync();
                }
                else
                {
                    return Results.BadRequest("only can delete last reading!");
                }
            }
            

            return Results.NoContent();
        });

        // PUT contracts/1/readings/1
        group.MapPut("/{id}/readings/{idReading}", async (int id, int idReading, UpdateReadingDto editedReading, PrinterMNGContext dbContext) =>
        {
            var contract = await dbContext.Contracts
                .Include(contract => contract.Printer)
                .Where(contract => contract.Id == id)
                .FirstOrDefaultAsync();

            if(contract is not null)
            {
                if(!contract.IsActive)
                {
                    return Results.BadRequest("The contract is not active!");
                }
                
                MonthlyReading? lastReading = await dbContext.MonthlyReadings
                                            .Where(reading => reading.ContractId == id)
                                            .OrderByDescending(reading => reading.Month)
                                            .FirstOrDefaultAsync();

                MonthlyReading? previousReading = await dbContext.MonthlyReadings
                                                .Where(reading => reading.ContractId == id)
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
                            return Results.BadRequest("The date of the reading cannot be previous to the last one.");
                        }

                        if (blackCounter < previousReading?.BlackCounter)
                        {
                            return Results.BadRequest("Black counter cannot be lower than previous reading.");
                        }

                        if (colorCounter < previousReading?.ColorCounter)
                        {
                            return Results.BadRequest("Color counter cannot be lower than previous reading.");
                        }

                        if(previousReading is not null) 
                        {
                            blackCopiesUsed = blackCounter - previousReading.BlackCounter;
                            colorCopiesUsed = colorCounter - previousReading.ColorCounter;
                        }
                        blackCharge = blackCopiesUsed * contract.BlackCopyPrice;
                        colorCharge = colorCopiesUsed * contract.ColorCopyPrice;

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
                        lastReading.TotalCharge = colorCharge;
                        lastReading.BlackCopiesUsed = blackCopiesUsed;
                        lastReading.ColorCopiesUsed = colorCopiesUsed;
                        lastReading.Notes = editedReading.Notes;
                        
                        await dbContext.SaveChangesAsync();
 
                        return Results.NoContent();

                    }
                    else
                    {
                        return Results.BadRequest("There was an error editing this reading!");
                    }
                }
            }
            
            return Results.BadRequest("Couldn't edit the reading. Check the validity of the data");
  
        });
    }
}