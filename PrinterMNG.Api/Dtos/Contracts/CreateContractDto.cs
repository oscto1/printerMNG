using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;

namespace PrinterMNG.Api.Dtos.Contracts;

public record CreateContractDto(
    [Required][Range(1,10000)]
    int ClientId,
    
    [Required][Range(1,10000)]
    int PrinterId,

    [StringLength(80, MinimumLength = 3)]
    [RegularExpression(@"^[A-Za-zÀ-ÿ\s]+$", ErrorMessage = "Path contains invalid characters.")]
    string? PDFPath,

    [Required][Range(0,10000)]
    decimal BlackCopyPrice,

    [Range(0,10000)]
    decimal ColorCopyPrice,

    [Range(0,10000000)]
    decimal MinimumCharge,

    [Required]
    DateOnly StartDate,

    [Required][Range(1,31)]
    int BillDay
);