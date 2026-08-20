using System.ComponentModel.DataAnnotations;
namespace PrinterMNG.Api.Dtos.Auth;
public record LoginUserDto(
    [Required(ErrorMessage = "USERNAME_REQUIRED")]
    string Username,

    [Required(ErrorMessage = "PASSWORD_REQUIRED")]
    string Password
);