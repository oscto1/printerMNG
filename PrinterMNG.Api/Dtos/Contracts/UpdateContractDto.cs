using System.ComponentModel.DataAnnotations;

namespace PrinterMNG.Api.Dtos.Contracts;

public record UpdateContractDto(
    [Required][Range(1,10000)]
    int ClientId,
    
    [Required][Range(1,10000)]
    int PrinterId,

    [StringLength(80, MinimumLength = 3)]
    [RegularExpression(@"^[A-Za-zÀ-ÿ\s]+$", ErrorMessage = "Path contains invalid characters.")]
    string? PDFPath,

    [Required]
    bool IsActive,

    [Required][Range(0,10000)]
    decimal BlackCopyPrice,

    [Range(0,10000)]
    decimal ColorCopyPrice,

    [Required][Range(0,10000000)]
    decimal MinimumCharge,

    [Required]
    DateOnly StartDate,

    DateOnly? EndDate,

    [Required][Range(1,31)]
    int BillDay
);