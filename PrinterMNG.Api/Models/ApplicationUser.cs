using Microsoft.AspNetCore.Identity;

namespace PrinterMNG.Api.Models;
public class ApplicationUser : IdentityUser
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}