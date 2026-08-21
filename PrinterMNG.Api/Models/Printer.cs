namespace PrinterMNG.Api.Models;

public class Printer
{
    public int Id { get; set; }
    public Brand? Brand { get; set; }
    public int BrandId { get; set; }
    public string Model { get; set; } = "";
    public bool IsColorPrinter { get; set;}

    public string AdminId { get; set;} = String.Empty;
    public ApplicationUser Admin { get; set;} = null!;
}