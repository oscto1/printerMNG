using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;

namespace PrinterMNG.Api.Dtos.Contracts;

public record CreateContractDto(
    [Required][Range(1,10000)]
    int ClientId,
    
    [Required][Range(1,10000)]
    int PrinterId,

    [Required][Range(0,100000)]
    int MinimumBlackCopies,

    [Range(0,100000)]
    int MinimumColorCopies,

    [Required][Range(0,10000)]
    decimal NormalBlackPrice,

    [Range(0,10000)]
    decimal NormalColorPrice,

    [Required][Range(0,10000)]
    decimal IncreasedBlackPrice,

    [Range(0,10000)]
    decimal IncreasedColorPrice,

    [Required]
    DateOnly StartDate,

    [Required][Range(1,31)]
    int BillDay
);