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

            //DEMO DATA
            Client demoClient = new()
            {
                Document = "12345678",
                Name = "John Doe",
                Phone = "3123456789",
                Location = "Bogota",
                CreatedAt = DateTime.UtcNow,
                AdminId = newUser.Id
            };
            dbContext.Clients.Add(demoClient);

            Printer demoPrinter = new()
            {
                Model = "eStudio 3505AC",
                BrandId = 1,
                IsColorPrinter = true,
                AdminId = newUser.Id
            };
            dbContext.Printers.Add(demoPrinter);

            DateOnly startDate = DateOnly.FromDateTime(DateTime.UtcNow).AddMonths(-2);
            
            Contract demoContract = new()
            {
                IsActive = true,
                Client = demoClient,
                Printer = demoPrinter,
                BlackCopyPrice = 100,
                ColorCopyPrice = 250,
                MinimumCharge = 500000,
                StartDate = startDate,
                BillDay = startDate.Day
            };
            dbContext.Contracts.Add(demoContract);

            MonthlyReading demoReading1 = new()
            {
                Contract = demoContract,
                Month = startDate,
                BlackCounter = 3000,
                ColorCounter = 1400,
                BlackCopiesUsed = 0,
                ColorCopiesUsed = 0,
                BlackCharge = 0,
                ColorCharge = 0,
                TotalCharge = 0,
                Notes = "",
                CreatedAt = DateTime.UtcNow,
            };
            dbContext.MonthlyReadings.Add(demoReading1);

            MonthlyReading demoReading2 = new()
            {
                Contract = demoContract,
                Month = startDate.AddMonths(1),
                BlackCounter = 6700,
                ColorCounter = 2800,
                BlackCopiesUsed = 3700,
                ColorCopiesUsed = 1400,
                BlackCharge = 370000,
                ColorCharge = 350000,
                TotalCharge = 720000,
                Notes = "",
                CreatedAt = DateTime.UtcNow,
            };  
            dbContext.MonthlyReadings.Add(demoReading2);

            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return Results.Ok();
        }).RequireRateLimiting("auth");

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
        }).RequireRateLimiting("auth"); 
    }
}