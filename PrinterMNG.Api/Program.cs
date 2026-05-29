using PrinterMNG.Api.Dtos;
using PrinterMNG.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPrintersEndpoints();

app.Run();
