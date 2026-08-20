
using Microsoft.AspNetCore.Identity;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos.Auth;
using PrinterMNG.Api.Models;

namespace PrinterMNG.Api.Endpoints.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/register");

        group.MapPost("", async (RegisterUser registerUser, PrinterMNGContext dbContext, UserManager<ApplicationUser> userManager) =>
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync();

            ApplicationUser newUser = new()
            {
                UserName = registerUser.Username,
            };
            
            IdentityResult identityResult = await userManager.CreateAsync(newUser, registerUser.Password);

            if(!identityResult.Succeeded)
            {
                await transaction.RollbackAsync();
                return Results.BadRequest(identityResult.Errors);
            }

            IdentityResult addToRoleResult = await userManager.AddToRoleAsync(newUser, Roles.Admin);
            if(!addToRoleResult.Succeeded)
            {
                await transaction.RollbackAsync();
                return Results.BadRequest(addToRoleResult.Errors);
            }

            await transaction.CommitAsync();

            return Results.Ok();
        });
    }
}