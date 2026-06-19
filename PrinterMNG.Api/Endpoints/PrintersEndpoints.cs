using System.Collections.Immutable;
using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos;
using PrinterMNG.Api.Models;

namespace PrinterMNG.Api.Endpoints;

public static class PrintersEndpoints
{
    const string GetPrinterEndpointName = "GetPrinter";

    public static void MapPrintersEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/printers");
        // GET /printers
        group.MapGet("/", async (PrinterMNGContext dbContext) =>
        {
            return await dbContext.Printers
                .Include(printer => printer.Brand)
                .Select(printer => new PrinterSummaryDto(
                    printer.Id,
                    printer.Brand!.Name,
                    printer.Model,
                    printer.IsColorPrinter
                ))
                .AsNoTracking()
                .ToListAsync();
        });


        // GET /printers/1
        group.MapGet("/{id}", async (int id, PrinterMNGContext dbContext) => {

            var printer = await dbContext.Printers.FindAsync(id);

            if (printer != null)
            {
                return Results.Ok(new PrinterDetailsDto(printer.Id, printer.BrandId, printer.Model, printer.IsColorPrinter));
            }
            else
            {
                return Results.NotFound();
            }
        }).WithName(GetPrinterEndpointName);


        // POST /printers
        group.MapPost("/", async (CreatePrinterDto newPrinter, PrinterMNGContext dbContext) =>
        {
            Printer printer = new()
            {
                Model = newPrinter.ModelName,
                BrandId = newPrinter.BrandId,
                IsColorPrinter = newPrinter.IsColorPrinter,
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
        });

        // PUT /printers/1
        group.MapPut("/{id}", async (int id, UpdatePrinterDto updatedPrinter, PrinterMNGContext dbContext) =>
        {

            var printer = await dbContext.Printers.FindAsync(id);

            if (printer is null)
            {
                return Results.NotFound();
            }

            printer.BrandId = updatedPrinter.BrandId;
            printer.Model = updatedPrinter.ModelName;
            printer.IsColorPrinter = updatedPrinter.IsColorPrinter;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });


        // DELETE /printers/1
        group.MapDelete("/{id}", async (int id, PrinterMNGContext dbContext) =>
        {
            await dbContext.Printers.Where(printer => printer.Id == id).ExecuteDeleteAsync();

            return Results.NoContent();     
        });
    }
}

