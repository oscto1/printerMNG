using System.ComponentModel.DataAnnotations;
namespace PrinterMNG.Api.Dtos.Auth;
public record RegisterUserDto(
    [Required(ErrorMessage = "USERNAME_REQUIRED")]
    [StringLength(18, MinimumLength = 3, ErrorMessage = "WRONG_USERNAME_CHAR_COUNT")]
    [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "USERNAME_INVALID_CHARACTERS")]
    string Username,

    [Required(ErrorMessage = "PASSWORD_REQUIRED")]
    [StringLength(128, MinimumLength = 6, ErrorMessage = "WRONG_PASSWORD_CHAR_COUNT")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$", ErrorMessage = "PASSWORD_INVALID_FORMAT")]
    string Password
);