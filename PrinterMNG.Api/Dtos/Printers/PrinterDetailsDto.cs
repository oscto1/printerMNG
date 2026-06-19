namespace PrinterMNG.Api.Dtos.Printers;
public record PrinterDetailsDto(
  int Id,
  int BrandId,
  string ModelName,
  bool IsColorPrinter
);
