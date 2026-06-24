namespace PrinterMNG.Api.Dtos.Contracts;
public record ContractSummaryDto(
    int Id,
    string ClientName,
    string PrinterModel,
    bool IsColorPrinter,
    bool IsActive,
    int MinimumBlackCopies,
    int MinimumColorCopies,
    decimal NormalBlackPrice,
    decimal NormalColorPrice,
    decimal IncreasedBlackPrice,
    decimal IncreasedColorPrice,
    DateOnly StartDate,
    int BillDay
);