namespace PrinterMNG.Api.Models;
public class MonthlyReading
{
    public int Id { get; set; }

    public int ContractId { get; set; }
    public Contract Contract { get; set; } = null!;

    public DateOnly Month { get; set; }

    public int ColorCounter { get; set; }
    public int BlackCounter { get; set; }

    //Calculated using previous month 
    public int BlackCopiesUsed { get; set; }
    public int ColorCopiesUsed { get; set; }

    //Billing calculation
    public decimal BlackCharge { get; set; }
    public decimal ColorCharge { get; set; }
    public decimal TotalCharge { get; set; }
    
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
}