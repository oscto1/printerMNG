using System.ComponentModel.DataAnnotations;

namespace PrinterMNG.Api.Dtos.Clients;
public record CreateClientDto(
    [Required][StringLength(18, MinimumLength = 5)]
    [RegularExpression(@"^\d+$")]
    int Id,

    [Required][RegularExpression(@"^[A-Za-zÀ-ÿ\s]{1,50}$")]
    string Name,

    [Required][RegularExpression(@"^3\d{9}$")]
    string Phone,

    [Required][RegularExpression(@"^[A-Za-zÀ-ÿ0-9\s#,\.-]{1,30}$")]
    string Location
);