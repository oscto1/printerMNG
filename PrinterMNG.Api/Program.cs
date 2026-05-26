using PrinterMNG.Api.Dtos;

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
    //PrinterModelDto printerTest = 
    Console.WriteLine(printerModels.Find(printer => printer.Id == id));
    return printerModels.Find(printer => printer.Id == id); 
});

// POST /printers
app.MapPost("/printers", (CreatePrinterDto newPrinter) =>
{

});

app.Run();
