using System.ComponentModel.DataAnnotations;
namespace PrinterMNG.Api.Dtos.Clients;

public record UpdateClientDto(
    [StringLength(18, MinimumLength = 5, ErrorMessage = "INVALID_CLIENT_DOCUMENT")]
    [RegularExpression(@"^\d+$", ErrorMessage = "INVALID_CLIENT_DOCUMENT")]
    string Document,

    [StringLength(50, MinimumLength = 3, ErrorMessage = "INVALID_CLIENT_NAME")]
    [RegularExpression(@"^[A-Za-zÀ-ÿ\s]+$", ErrorMessage = "INVALID_CLIENT_NAME")]
    string Name,

    [StringLength(10, MinimumLength = 10, ErrorMessage = "INVALID_CLIENT_PHONE")]
    [RegularExpression(@"^3\d+$", ErrorMessage = "INVALID_CLIENT_PHONE")]
    string Phone,

    [StringLength(30, MinimumLength = 3, ErrorMessage = "INVALID_CLIENT_LOCATION")]
    [RegularExpression(@"^[A-Za-zÀ-ÿ0-9\s#,\.-]+$", ErrorMessage = "INVALID_CLIENT_LOCATION")]
    string Location
);