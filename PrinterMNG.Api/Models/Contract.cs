namespace PrinterMNG.Api.Models;

public class Contract
{
    public int Id { get; set; }

    public string ClientId { get; set; } = null!;
    public Client Client { get; set; } = null!;

    public int PrinterId { get; set; }
    public Printer Printer { get; set; } = null!;

    public int MinimumBlackCopies { get; set; }
    public int MinimumColorCopies { get; set; }

    public decimal NormalBlackPrice { get; set; }
    public decimal NormalColorPrice { get; set; }

    public decimal IncreasedBlackPrice { get; set; }
    public decimal IncreasedColorPrice { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}