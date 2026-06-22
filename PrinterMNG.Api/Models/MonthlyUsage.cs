namespace PrinterMNG.Api.Models;
public class MonthlyUsage
{
    public int Id { get; set; }

    public int ContractId { get; set; }
    public Contract Contract { get; set; } = null!;

    public DateOnly Month { get; set; }

    public int ColorCounter { get; set; }
    public int BlackCounter { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
}