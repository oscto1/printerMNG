using PrinterMNG.Api.Models;

namespace PrinterMNG.Api.Dtos.MonthlyReadings;

public record ReadingSummaryDto(
    int Id,
    int ContractId,
    DateOnly Month,
    int BlackCounter,
    int Colorcounter,
    int BlackCopiesUsed,
    int ColorCopiesUsed,
    decimal BlackCharge,
    decimal ColorCharge,
    decimal TotalCharge,
    string? Notes
);