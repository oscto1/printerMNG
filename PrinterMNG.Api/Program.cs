using PrinterMNG.Api.Data;
using PrinterMNG.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddValidation();

var connString = "Data Source=PrinterMNG.db";

builder.Services.AddSqlite<PrinterMNGContext>(connString);

var app = builder.Build();

app.MapPrintersEndpoints();

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

app.Run();


