using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos.Contracts;
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
                        contract.MinimumBlackCopies,
                        contract.MinimumColorCopies,
                        contract.NormalBlackPrice,
                        contract.NormalColorPrice,
                        contract.IncreasedBlackPrice,
                        contract.IncreasedColorPrice,
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
                    contr.Printer.IsColorPrinter,
                    contr.IsActive,
                    contr.MinimumBlackCopies,
                    contr.MinimumColorCopies,
                    contr.NormalBlackPrice,
                    contr.NormalColorPrice,
                    contr.IncreasedBlackPrice,
                    contr.IncreasedColorPrice,
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
                MinimumBlackCopies = newContract.MinimumBlackCopies,
                MinimumColorCopies = newContract.MinimumColorCopies,
                NormalBlackPrice = newContract.NormalBlackPrice,
                NormalColorPrice = newContract.NormalColorPrice,
                IncreasedBlackPrice = newContract.IncreasedBlackPrice,
                IncreasedColorPrice = newContract.IncreasedColorPrice,
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
            contract.MinimumBlackCopies = newContract.MinimumBlackCopies;
            contract.MinimumColorCopies = newContract.MinimumColorCopies;
            contract.NormalBlackPrice = newContract.NormalBlackPrice;
            contract.NormalColorPrice = newContract.NormalColorPrice;
            contract.IncreasedBlackPrice = newContract.IncreasedBlackPrice;
            contract.IncreasedColorPrice = newContract.IncreasedColorPrice;
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
    }
}