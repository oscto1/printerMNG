using System.Security.Claims;
using Microsoft.AspNetCore.HttpOverrides;
using PrinterMNG.Api.Authorization;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddValidation();
builder.AddPrinterMNGdb();
builder.AddAuth();


// CORS config
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
var frontendUrl = builder.Configuration["Cors:FrontendUrl"];

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: myAllowSpecificOrigins,
        policy =>
        {
           policy.WithOrigins(frontendUrl!)
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials(); 
        });
});

// Forwarder headers to get the actual IP
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
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

app.UseForwardedHeaders();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();


app.Run();


