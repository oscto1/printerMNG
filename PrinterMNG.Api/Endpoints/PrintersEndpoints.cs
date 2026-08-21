// using System.Collections.Immutable;
using System.Diagnostics;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Authorization;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos.Printers;
using PrinterMNG.Api.Models;

namespace PrinterMNG.Api.Endpoints;

public static class PrintersEndpoints
{
    const string GetPrinterEndpointName = "GetPrinter";

    public static void MapPrintersEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/printers");
        // GET /printers
        group.MapGet("/", async (PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            List<PrinterSummaryDto> printers = await dbContext.Printers
                .Include(printer => printer.Brand)
                .Where(p => p.AdminId == userId)
                .Select(printer => new PrinterSummaryDto(
                    printer.Id,
                    printer.Brand!.Name,
                    printer.Model,
                    printer.IsColorPrinter
                ))
                .AsNoTracking()
                .ToListAsync();
                
            return Results.Ok(printers);
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));


        // GET /printers/1
        group.MapGet("/{id}", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) => {

            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var printer = await dbContext.Printers.FirstOrDefaultAsync(p => p.AdminId == userId && p.Id == id);

            if (printer != null)
            {
                return Results.Ok(new PrinterDetailsDto(printer.Id, printer.BrandId, printer.Model, printer.IsColorPrinter));
            }
            else
            {
                return Results.NotFound();
            }
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin))
        .WithName(GetPrinterEndpointName);


        // POST /printers
        group.MapPost("/", async (CreatePrinterDto newPrinter, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            Printer printer = new()
            {
                Model = newPrinter.ModelName,
                BrandId = newPrinter.BrandId,
                IsColorPrinter = newPrinter.IsColorPrinter,
                AdminId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!
            };

            dbContext.Printers.Add(printer);
            await dbContext.SaveChangesAsync();

            PrinterDetailsDto printerDto = new (
                printer.Id,
                printer.BrandId,
                printer.Model,
                printer.IsColorPrinter
            );


            return Results.CreatedAtRoute(GetPrinterEndpointName, new { id = printerDto.Id }, printerDto);    
        }).RequireAuthorization(policy => policy.RequireRole(Roles.Admin));

        // PUT /printers/1
        group.MapPut("/{id}", async (int id, UpdatePrinterDto updatedPrinter, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var printer = await dbContext.Printers.FirstOrDefaultAsync(p => p.AdminId == userId && p.Id == id);

            bool hasContracts = await dbContext.Contracts.AnyAsync(c => c.PrinterId == id && c.Client.AdminId == userId);

            // var printer = await dbContext.Printers.FindAsync(id);

            if (printer is null)
            {
                return Results.NotFound();
            }

            if (hasContracts)
            {
                // "Can't update printer because some contracts are using it!
                return Results.BadRequest(new { errors = "UPDATE_PRINTER_HAS_CONTRACTS"});
            }
            printer.BrandId = updatedPrinter.BrandId;
            printer.Model = updatedPrinter.ModelName;
            printer.IsColorPrinter = updatedPrinter.IsColorPrinter;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));


        // DELETE /printers/1
        group.MapDelete("/{id}", async (int id, PrinterMNGContext dbContext, HttpContext httpContext) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool hasContracts = await dbContext.Contracts.AnyAsync(c => c.PrinterId == id && c.Client.AdminId == userId);

            if(hasContracts)
            {
                // "Can't delete printer because some contracts are using it!"
                return Results.Conflict(new { errors = "DELETE_PRINTER_HAS_CONTRACTS"});
            }

            await dbContext.Printers.Where(printer => printer.Id == id && printer.AdminId == userId).ExecuteDeleteAsync();
            
            
            return Results.NoContent();     
        })
        .RequireAuthorization(policy => policy.RequireRole(Roles.Admin));
    }
}

