using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos.Clients;
using PrinterMNG.Api.Dtos.Contracts;
using PrinterMNG.Api.Dtos.Printers;
using PrinterMNG.Api.Models;

namespace PrinterMNG.Api.Endpoints;

public static class ClientsEndpoints
{
    const string GetClientEndpointName = "GetClient";

    public static void MapClientsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/clients");

        // GET /clients
        group.MapGet("/", async (PrinterMNGContext dbContext) =>
        {
            return await dbContext.Clients
                .Select(client => new ClientDetailsDto(client.Id, client.Document, client.Name, client.Phone, client.Location, client.CreatedAt))
                .AsNoTracking()
                .ToListAsync();         
        });

        //GET /clients/1
        group.MapGet("/{id}", async (int id, PrinterMNGContext dbContext) =>
        {
            var client = await dbContext.Clients.FindAsync(id);

            if(client is not null)
            {
                return Results.Ok(new ClientDetailsDto(client.Id, client.Document, client.Name, client.Phone, client.Location, client.CreatedAt));
            }

            return Results.NotFound();

        }).WithName(GetClientEndpointName);

        // POST /clients
        group.MapPost("/", async (CreateClientDto newClient, PrinterMNGContext dbContext) =>
        {
            Client client = new()
            {
                Document = newClient.Document,
                Name = newClient.Name,
                Phone = newClient.Phone,
                Location = newClient.Location,
                CreatedAt = DateTime.Now
            };

            dbContext.Clients.Add(client);
            await dbContext.SaveChangesAsync();

            ClientDetailsDto clientDto = new ClientDetailsDto(client.Id, client.Document, client.Name, client.Phone, client.Location, client.CreatedAt);

            return Results.CreatedAtRoute(GetClientEndpointName, new { id = clientDto.Id });
        });


        // PUT /clients/1
        group.MapPut("/{id}", async (int id, UpdateClientDto newClient, PrinterMNGContext dbContext) =>
        {
            var client = await dbContext.Clients.FindAsync(id);

            if(client is null)
            {
                return Results.NotFound();
            }

            client.Document = newClient.Document;
            client.Name = newClient.Name;
            client.Phone = newClient.Phone;
            client.Document = newClient.Document;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });


        // DELETE /clients/1
        group.MapDelete("/{id}", async (int id, PrinterMNGContext dbContext) =>
        {
            await dbContext.Clients.Where(client => client.Id == id).ExecuteDeleteAsync();

            return Results.NoContent();
        });

        // CLIENTS CONTRACTS -------------------------------------------------------
        // GET /clients/1/contracts

        group.MapGet("/{id}/contracts", async (int id, PrinterMNGContext dbContext) =>
        {
            return await dbContext.Contracts
                            .Include(contract => contract.Printer)
                            .Where(contract => contract.ClientId == id)
                            .Select(contract => new ContractDetailsDto(
                                contract.Id,
                                contract.ClientId,
                                contract.IsActive,
                                new PrinterDetailsDto(contract.Printer.Id, contract.Printer.BrandId, contract.Printer.Model, contract.Printer.IsColorPrinter),
                                contract.BlackCopyPrice,
                                contract.ColorCopyPrice,
                                contract.MinimumCharge,
                                contract.BillDay
                            ))  
                            .AsNoTracking()
                            .ToListAsync();
        });
    }
}