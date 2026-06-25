namespace PrinterMNG.Api.Models;

public class Contract
{
    public int Id { get; set; }
    public bool IsActive { get; set; }

    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;

    public int PrinterId { get; set; }
    public Printer Printer { get; set; } = null!;

    public string? ContractPdfPath { get; set; }

    // public int MinimumBlackCopies { get; set; }
    // public int MinimumColorCopies { get; set; }

    public decimal BlackCopyPrice { get; set; }
    public decimal ColorCopyPrice { get; set; }

    // public decimal MinimumBlackCharge { get; set; }
    public decimal MinimumCharge { get; set; }

    public DateOnly StartDate { get; set; }
    public int BillDay { get; set; }
    public DateOnly? EndDate { get; set; }

    public ICollection<MonthlyReading> MonthlyReadings { get; set; } = [];
}