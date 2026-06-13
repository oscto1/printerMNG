using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Models;

namespace PrinterMNG.Api.Data;
public static class DataExtensions
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<PrinterMNGContext>();

        dbContext.Database.Migrate();

    }

    public static void AddDatabaseSeeding(this WebApplicationBuilder builder)
    {
        var connString = "Data Source=PrinterMNG.db";

        builder.Services.AddSqlite<PrinterMNGContext>(
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
        );
    }
}