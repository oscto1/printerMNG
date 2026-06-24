using System.ComponentModel.DataAnnotations;

namespace PrinterMNG.Api.Dtos.Contracts;

public record UpdateContractDto(
    [Required][Range(1,10000)]
    int ClientId,
    
    [Required][Range(1,10000)]
    int PrinterId,

    [Required]
    bool IsActive,

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

    DateOnly? EndDate,

    [Required][Range(1,31)]
    int BillDay
);