namespace PrinterMNG.Api.Endpoints;

public static class ContractsEndpoints
{
    public static void MapContractsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/contracts");

        group.MapGet("/", async () =>
        {
            
        });
    }
}