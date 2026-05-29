using System.ComponentModel.DataAnnotations;

public record UpdatePrinterDto
(
    [Required][StringLength(30)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-]+$", ErrorMessage = "Brand contains invalid characters.")] 
    string Brand,

    [Required][StringLength(50)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-]+$", ErrorMessage = "Model contains invalid characters.")] 
    string ModelName,

    bool IsColorPrinter
);