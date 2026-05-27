namespace PrinterMNG.Api.Dtos;
public record PrinterModelDto(
  int Id,
  string Brand,
  string ModelName,
  bool IsColorPrinter
);
