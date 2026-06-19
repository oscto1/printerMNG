using System.ComponentModel.DataAnnotations;

public record CreatePrinterDto
(
    [Required][Range(1,20)]
    int BrandId,

    [Required][StringLength(50)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-]+$", ErrorMessage = "Model contains invalid characters.")] 
    string ModelName,

    bool IsColorPrinter
);
