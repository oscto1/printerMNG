using System.Security.Claims;
using PrinterMNG.Api.Authorization;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddValidation();
builder.AddPrinterMNGdb();
builder.AddAuth();

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

app.MapAuthEndpoints();
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
            await context.Response.WriteAsJsonAsync(new { errors = "Bad request." });
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new { errors = "Unexpected server error." });
        }
    });
});

await app.MigrateDb();

app.MapGet("/me", (ClaimsPrincipal claimsPrincipal) =>
{
    return Results.Ok(claimsPrincipal.Claims.ToDictionary(c => c.Type, c => c.Value));
})
.RequireAuthorization(policy => policy.RequireRole(Roles.Admin));

app.UseAuthentication();
app.UseAuthorization();

app.Run();


