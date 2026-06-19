namespace PrinterMNG.Api.Dtos.Printers;
public record PrinterSummaryDto(
  int Id,
  string Brand,
  string ModelName,
  bool IsColorPrinter
);
