using PrinterMNG.Api.Dtos;

namespace PrinterMNG.Api.Endpoints;

public static class PrintersEndpoints
{
    const string GetPrinterEndpointName = "GetPrinter";

    private static readonly List<PrinterModelDto> printerModels = [
        new PrinterModelDto(1, "Toshiba", "eStudio 0000", true),
        new PrinterModelDto(2, "Toshiba", "eStudio 0001", false),
        new PrinterModelDto(3, "Canon", "CV1", true),
    ];

    public static void MapPrintersEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/printers");
        // GET /printers
        group.MapGet("/", () => printerModels);


        // GET /printers/1
        group.MapGet("/{id}", (int id) => {

            var printer = printerModels.Find(printer => printer.Id == id);

            if (printer != null)
            {
                return Results.Ok(printer);
            }
            else
            {
                return Results.NotFound();
            }
        }).WithName(GetPrinterEndpointName);


        // POST /printers
        group.MapPost("/", (CreatePrinterDto newPrinter) =>
        {
            PrinterModelDto printerToAdd = new PrinterModelDto(printerModels.Count + 1, newPrinter.Brand, newPrinter.ModelName, newPrinter.IsColorPrinter);
            printerModels.Add(printerToAdd);
            return Results.CreatedAtRoute(GetPrinterEndpointName, new { id = printerToAdd.Id }, printerToAdd);    
        });

        // PUT /printers/1
        group.MapPut("/{id}", (int id, UpdatePrinterDto updatedPrinter) =>
        {
            var index = printerModels.FindIndex(printer => printer.Id == id);

            if (index == -1)
            {
                return Results.NotFound();
            }

            printerModels[index] = new PrinterModelDto(id, updatedPrinter.Brand, updatedPrinter.ModelName, updatedPrinter.IsColorPrinter);

            return Results.NoContent();
        });


        // DELETE /printers/1
        group.MapDelete("/{id}", (int id) =>
        {
            
            printerModels.RemoveAll(printer => printer.Id == id);

            return Results.NoContent();     
        });
    }
}

