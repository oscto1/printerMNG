using System.ComponentModel.DataAnnotations;

namespace PrinterMNG.Api.Dtos.MonthlyReadings;

public record UpdateReadingDto(

    [Required][RegularExpression(@"^\d{4}-(0[1-9]|1[0-2])$", ErrorMessage = "Incorrect month format")]
    string Month,

    [Required][Range(0, 10000000)]
    int BlackCounter,

    [Range(0, 10000000)]
    int ColorCounter,

    [StringLength(150)]
    [RegularExpression(@"^[\p{L}\p{N} ]+$", ErrorMessage = "Notes contains invalid characters.")]
    string? Notes
);