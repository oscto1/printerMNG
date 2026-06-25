namespace PrinterMNG.Api.Dtos.Contracts;

public record ContractDetailsDto(
    int Id,
    int ClientId,
    int PrinterId,
    decimal BlackCopyPrice,
    decimal ColorCopyPrice,
    decimal MinimumCharge,
    int BillDay  
);