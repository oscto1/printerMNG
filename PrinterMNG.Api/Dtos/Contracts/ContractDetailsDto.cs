using PrinterMNG.Api.Dtos.Printers;

namespace PrinterMNG.Api.Dtos.Contracts;

public record ContractDetailsDto(
    int Id,
    int ClientId,
    bool IsActive,
    PrinterDetailsDto Printer,
    decimal BlackCopyPrice,
    decimal ColorCopyPrice,
    decimal MinimumCharge,
    int BillDay  
);