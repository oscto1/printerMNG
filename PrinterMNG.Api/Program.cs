using PrinterMNG.Api.Dtos;

const string GetPrinterEndpointName = "GetPrinter";

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();



List<PrinterModelDto> printerModels = [
    new PrinterModelDto(1, "Toshiba", "eStudio 0000", true),
    new PrinterModelDto(2, "Toshiba", "eStudio 0001", false),
    new PrinterModelDto(3, "Canon", "CV1", true),
];

// GET /printers
app.MapGet("/printers", () => printerModels);


// GET /printers/1
app.MapGet("/printers/{id}", (int id) => {
    Console.WriteLine(printerModels.Find(printer => printer.Id == id));
    return printerModels.Find(printer => printer.Id == id); 
}).WithName(GetPrinterEndpointName);


// POST /printers
app.MapPost("/printers", (CreatePrinterDto newPrinter) =>
{
    PrinterModelDto printerToAdd = new PrinterModelDto(printerModels.Count + 1, newPrinter.Brand, newPrinter.ModelName, newPrinter.IsColorPrinter);
    printerModels.Add(printerToAdd);

    return Results.CreatedAtRoute(GetPrinterEndpointName, new { id = printerToAdd.Id }, printerToAdd);
});

// PUT /printers/1
app.MapPut("/printers/{id}", (int id, UpdatePrinterDto updatedPrinter) =>
{
    try
    {
        var index = printerModels.FindIndex(printer => printer.Id == id);

        printerModels[index] = new PrinterModelDto(id, updatedPrinter.Brand, updatedPrinter.ModelName, updatedPrinter.IsColorPrinter);

        return Results.NoContent();
    }
    catch(Exception e)
    {
        return Results.InternalServerError($"There was an error updating the printer\n{e.Message}");
    }
});


// DELETE /printers/1
app.MapDelete("/printers/{id}", (int id) =>
{
    try
    {
        printerModels.RemoveAll(printer => printer.Id == id);

        return Results.NoContent();
    }
    catch (Exception e)
    {
        return Results.InternalServerError($"There was an error deleting the printer\n{e.Message}");
    }
});

app.Run();
