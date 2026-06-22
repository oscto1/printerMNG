using System.ComponentModel.DataAnnotations;
namespace PrinterMNG.Api.Dtos.Clients;

public record UpdateClientDto(
    [StringLength(18, MinimumLength = 5)]
    [RegularExpression(@"^\d+$", ErrorMessage = "Id contains invalid characters.")]
    string Document,

    [StringLength(50, MinimumLength = 3)]
    [RegularExpression(@"^[A-Za-zÀ-ÿ\s]+$", ErrorMessage = "Name contains invalid characters.")]
    string Name,

    [StringLength(10, MinimumLength = 10)]
    [RegularExpression(@"^3\d+$", ErrorMessage = "Phone characters must be numbers")]
    string Phone,

    [StringLength(30, MinimumLength = 3)]
    [RegularExpression(@"^[A-Za-zÀ-ÿ0-9\s#,\.-]+$", ErrorMessage = "Location contains invalid characters.")]
    string Location
);