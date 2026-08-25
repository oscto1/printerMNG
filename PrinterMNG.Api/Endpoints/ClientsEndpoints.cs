using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Authorization;
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
        group.MapGet("/", async (PrinterMNGContext dbContext, UserManager<ApplicationUser> userManager, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            // Console.WriteLine(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            return await dbContext.Clients
                .Where(c => c.AdminId == userId)
                .Select(client => new ClientDetailsDto(client.Id, client.Document, client.Name, client.Phone, client.Location, client.CreatedAt))
                .AsNoTracking()
                .ToListAsync();         
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));

        //GET /clients/1
        group.MapGet("/{id}", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var client = await dbContext.Clients.FirstOrDefaultAsync(c => c.Id == id && c.AdminId == userId);

            if(client is not null)
            {
                return Results.Ok(new ClientDetailsDto(client.Id, client.Document, client.Name, client.Phone, client.Location, client.CreatedAt));
            }

            return Results.NotFound();

        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin))
        .WithName(GetClientEndpointName);

        // POST /clients
        group.MapPost("/", async (CreateClientDto newClient, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            Client client = new()
            {
                Document = newClient.Document,
                Name = newClient.Name,
                Phone = newClient.Phone,
                Location = newClient.Location,
                CreatedAt = DateTime.UtcNow,
                AdminId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!
            };

            dbContext.Clients.Add(client);
            await dbContext.SaveChangesAsync();

            ClientDetailsDto clientDto = new ClientDetailsDto(client.Id, client.Document, client.Name, client.Phone, client.Location, client.CreatedAt);

            return Results.CreatedAtRoute(GetClientEndpointName, new { id = clientDto.Id });
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));


        // PUT /clients/1
        group.MapPut("/{id}", async (int id, UpdateClientDto newClient, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var client = await dbContext.Clients.FirstOrDefaultAsync(c => c.Id == id && c.AdminId == userId);

            if(client is null)
            {
                return Results.NotFound();
            }

            client.Document = newClient.Document;
            client.Name = newClient.Name;
            client.Phone = newClient.Phone;
            client.Location = newClient.Location;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));


        // DELETE /clients/1
        group.MapDelete("/{id}", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isOwner = await dbContext.Clients.AnyAsync(c => c.AdminId == userId && c.Id == id);

            if (!isOwner)
            {
                return Results.NotFound();
            }

            bool hasContracts = await dbContext.Contracts.AnyAsync(c => c.ClientId == id);

            if(hasContracts)
            {
                return Results.Conflict(new {errors = "DELETE_CLIENT_HAS_CONTRACTS"});
            }

            await dbContext.Clients.Where(client => client.Id == id).ExecuteDeleteAsync();

            return Results.NoContent();
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));


        // CLIENTS CONTRACTS -------------------------------------------------------
        // GET /clients/1/contracts

        group.MapGet("/{id}/contracts", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isOwner = await dbContext.Clients.AnyAsync(c => c.AdminId == userId && c.Id == id);

            if (!isOwner)
            {
                return Results.NotFound();
            }

            var contracts = await dbContext.Contracts
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

            return Results.Ok(contracts);
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));
    }
}