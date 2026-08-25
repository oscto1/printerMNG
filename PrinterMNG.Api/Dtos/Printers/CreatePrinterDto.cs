using System.ComponentModel.DataAnnotations;
namespace PrinterMNG.Api.Dtos.Printers;
public record CreatePrinterDto
(
    [Required(ErrorMessage = "INVALID_BRANDID")][Range(1,10000, ErrorMessage = "INVALID_BRANDID")]
    int BrandId,

    [Required(ErrorMessage = "INVALID_MODELNAME")][StringLength(50, MinimumLength = 3, ErrorMessage = "INVALID_MODELNAME")]
    [RegularExpression(@"^[a-zA-Z0-9\s\-]+$", ErrorMessage = "INVALID_MODELNAME")] 
    string ModelName,

    bool IsColorPrinter
);
