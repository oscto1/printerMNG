using System.ComponentModel.DataAnnotations;

namespace PrinterMNG.Api.Dtos.MonthlyReadings;

public record UpdateReadingDto(

    [Required(ErrorMessage = "INVALID_MONTH_FORMAT")][RegularExpression(@"^\d{4}-(0[1-9]|1[0-2])$", ErrorMessage = "INVALID_MONTH_FORMAT")]
    string Month,

    [Required(ErrorMessage = "INVALID_BLACK_COUNTER")][Range(0, 10000000, ErrorMessage = "INVALID_BLACK_COUNTER")]
    int BlackCounter,

    [Range(0, 10000000, ErrorMessage = "INVALID_COLOR_COUNTER")]
    int ColorCounter,

    [StringLength(150, ErrorMessage = "INVALID_NOTES")]
    [RegularExpression(@"^[\p{L}\p{N} ]+$", ErrorMessage = "INVALID_NOTES")]
    string? Notes
);