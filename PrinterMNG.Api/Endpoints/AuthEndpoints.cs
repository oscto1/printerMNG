using Microsoft.AspNetCore.Identity;
using PrinterMNG.Api.Data;
using PrinterMNG.Api.Dtos.Auth;
using PrinterMNG.Api.Models;
using PrinterMNG.Api.Authorization;
using Microsoft.Extensions.Options;
using PrinterMNG.Api.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace PrinterMNG.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        // var group = app.MapGroup("/register");

        app.MapPost("/register", async (RegisterUserDto registerUser, PrinterMNGContext dbContext, UserManager<ApplicationUser> userManager) =>
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

        app.MapPost("/login", async (LoginUserDto userBody, UserManager<ApplicationUser> userManager, IOptions<JwtOptions> jwtOptions, HttpContext httpContext) =>
        {
            var user = await userManager.FindByNameAsync(userBody.Username);

            if(user is null || !await userManager.CheckPasswordAsync(user, userBody.Password))
            {
                return Results.Unauthorized();
            }

            IList<string> roles = await userManager.GetRolesAsync(user);

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Value.SecretKey!));

            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            List<Claim> claims =
            [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Name, user.UserName!),
                ..roles.Select(r => new Claim(ClaimTypes.Role, r))
            ];

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(jwtOptions.Value.ExpirationInMinutes),
                SigningCredentials = credentials,
                Issuer = jwtOptions.Value.Issuer,
                Audience = jwtOptions.Value.Audience
            };

            var tokenHandler = new JsonWebTokenHandler();

            var accessToken = tokenHandler.CreateToken(tokenDescriptor);

            httpContext.Response.Cookies.Append("access_token", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite =  SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(jwtOptions.Value.ExpirationInMinutes)
            });

            return Results.Ok();
        }); 
    }
}