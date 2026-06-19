using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos;

namespace PrinterMNG.Api.Endpoints;

public static class BrandsEndpoints
{
    public static void MapBrandsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/brands");

        group.MapGet("/", async (PrinterMNGContext dbContext) =>
        {
            return await dbContext.Brands
                .Select(brand => new BrandDto(
                    brand.Id,
                    brand.Name
                ))
                .AsNoTracking()
                .ToListAsync();
        });
    }
}