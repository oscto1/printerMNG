using System.ComponentModel.DataAnnotations;
namespace PrinterMNG.Api.Dtos.Printers;
public record UpdatePrinterDto
(
    [Required][Range(1,10000, ErrorMessage = "Select a valid printer.")]
    int BrandId,

    [Required][StringLength(50, MinimumLength = 3)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-]+$", ErrorMessage = "Model contains invalid characters.")] 
    string ModelName,

    bool IsColorPrinter
);