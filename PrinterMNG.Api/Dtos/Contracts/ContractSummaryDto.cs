namespace PrinterMNG.Api.Dtos.Contracts;
public record ContractSummaryDto(
    int Id,
    string ClientName,
    string PrinterModel,
    string? PDFPath,
    bool IsColorPrinter,
    bool IsActive,
    decimal BlackCopyPrice,
    decimal ColorCopyPrice,
    decimal MinimumCharge,
    DateOnly StartDate,
    int BillDay
);