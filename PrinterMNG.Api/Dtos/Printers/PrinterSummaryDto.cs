namespace PrinterMNG.Api.Dtos;
public record PrinterSummaryDto(
  int Id,
  string Brand,
  string ModelName,
  bool IsColorPrinter
);
