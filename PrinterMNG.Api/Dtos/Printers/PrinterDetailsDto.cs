namespace PrinterMNG.Api.Dtos;
public record PrinterDetailsDto(
  int Id,
  int BrandId,
  string ModelName,
  bool IsColorPrinter
);
