namespace PrinterMNG.Api.Dtos.Contracts;

public record ContractDetailsDto(
    int Id,
    int ClientId,
    int PrinterId,
    int MinimumBlackCopies,
    int MinimumColorCopies,
    decimal NormalBlackPrice,
    decimal NormalColorPrice,
    decimal IncreasedBlackPrice,
    decimal IncreasedColorPrice,
    int BillDay  
);