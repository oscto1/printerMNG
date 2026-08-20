using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Models;
using PrinterMNG.Api.Authorization;
using PrinterMNG.Api.Options;

namespace PrinterMNG.Api.Data;
public static class DataExtensions
{
    public static async Task MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<PrinterMNGContext>();

        await dbContext.Database.MigrateAsync();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        if(!await roleManager.RoleExistsAsync(Roles.Admin))
        {
            await roleManager.CreateAsync(new IdentityRole(Roles.Admin));
        }
    }

    public static void AddPrinterMNGdb(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration.GetConnectionString("PrinterMNG");
        // builder.Services.AddScoped<PrinterMNGContext>();
        builder.Services.AddNpgsql<PrinterMNGContext>(
            connString, 
            optionsAction: options => options.UseSeeding((context, _) =>
                {
                    if(!context.Set<Brand>().Any())
                    {
                        context.Set<Brand>().AddRange(
                            new Brand {Id = 1, Name = "Toshiba"},
                            new Brand {Id = 2, Name = "Canon"}
                        );

                        context.SaveChanges();
                    }
                })
                .UseAsyncSeeding(async (context, _, cancellationToken) =>
                {
                    if(!await context.Set<Brand>().AnyAsync(cancellationToken))
                    {
                        await context.Set<Brand>().AddRangeAsync(
                            [
                                new Brand { Id = 1, Name = "Toshiba" },
                                new Brand { Id = 2, Name = "Canon" }
                            ],
                            cancellationToken
                        );

                        await context.SaveChangesAsync(cancellationToken);
                    }
                })

        );
    }

    public static void AddIdentity(this WebApplicationBuilder builder)
    {
        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<PrinterMNGContext>();

        builder.Services.AddOptions<JwtOptions>()
            .Bind(builder.Configuration.GetSection(JwtOptions.SectionName))
            .Validate(options =>
                !string.IsNullOrWhiteSpace(options.SecretKey),
                "JWT SecretKey must be configured.")
            .ValidateOnStart();
    }
}