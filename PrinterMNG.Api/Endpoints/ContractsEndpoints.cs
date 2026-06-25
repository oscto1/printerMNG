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
                    .Select(contract => new ContractDetailsDto(
                        contract.Id,
                        contract.ClientId,
                        contract.PrinterId,
                        contract.BlackCopyPrice,
                        contract.ColorCopyPrice,
                        contract.MinimumCharge,
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
            Contract contract = new()
            {
                IsActive = true,
                ClientId = newContract.ClientId,
                PrinterId = newContract.PrinterId,
                BlackCopyPrice = newContract.BlackCopyPrice,
                ColorCopyPrice = newContract.ColorCopyPrice,
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

            if(contract is null)
            {
                return Results.NotFound();
            }

            contract.ClientId = newContract.ClientId;
            contract.PrinterId = newContract.PrinterId;
            contract.IsActive = newContract.IsActive;
            contract.BlackCopyPrice = newContract.BlackCopyPrice;
            contract.ColorCopyPrice = newContract.ColorCopyPrice;
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
            var lastReading = await dbContext.MonthlyReadings
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
                    return Results.BadRequest("Only can delete the last reading!");
                }
            }
            

            return Results.NoContent();
        });

        
    }
}