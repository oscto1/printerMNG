using PrinterMNG.Api.Data;
using PrinterMNG.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddValidation();
builder.AddPrinterMNGdb();

var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: myAllowSpecificOrigins,
        policy =>
        {
           policy.WithOrigins("http://localhost:3000")
                                .AllowAnyHeader()
                                .AllowAnyMethod(); 
        });
});


var app = builder.Build();

app.UseCors(myAllowSpecificOrigins);

app.MapPrintersEndpoints();
app.MapBrandsEndpoints();
app.MapClientsEndpoints();
app.MapContractsEndpoints();
app.MapMonthlyReadingsEndpoints();

app.UseExceptionHandler(exceptionApp =>
{
    exceptionApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        context.Response.ContentType = "application/json";

        if (exception is BadHttpRequestException)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new { error = "Bad request." });
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new { error = "Unexpected server error." });
        }
    });
});

app.MigrateDb();

app.Run();


