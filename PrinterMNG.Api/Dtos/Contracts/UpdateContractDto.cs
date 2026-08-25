using System.ComponentModel.DataAnnotations;

namespace PrinterMNG.Api.Dtos.Contracts;

public record UpdateContractDto(
    [Required][Range(1,10000)]
    int ClientId,
    
    [Required(ErrorMessage = "INVALID_PRINTER_ID")][Range(1,10000, ErrorMessage = "INVALID_PRINTER_ID")]
    int PrinterId,

    [StringLength(80, MinimumLength = 3, ErrorMessage = "INVALID_PDF_PATH")]
    [RegularExpression(@"^[A-Za-zÀ-ÿ\s]+$", ErrorMessage = "INVALID_PDF_PATH")]
    string? PDFPath,

    [Required]
    bool IsActive,

    [Required(ErrorMessage = "INVALID_B_COPY_PRICE")][Range(0,10000, ErrorMessage = "INVALID_B_COPY_PRICE")]
    decimal BlackCopyPrice,

    [Range(0,10000, ErrorMessage = "INVALID_C_COPY_PRICE")]
    decimal ColorCopyPrice,

    [Required(ErrorMessage = "INVALID_MINIMUM_CHARGE")][Range(0,10000000, ErrorMessage = "INVALID_MINIMUM_CHARGE")]
    decimal MinimumCharge,

    [Required]
    DateOnly StartDate,

    DateOnly? EndDate,

    [Required][Range(1,31)]
    int BillDay
);