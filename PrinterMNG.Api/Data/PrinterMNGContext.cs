using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Models;


namespace PrinterMNG.Api.Data;

public class PrinterMNGContext(DbContextOptions<PrinterMNGContext> options) : DbContext(options)
{
    public DbSet<Printer> Printers => Set<Printer>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<MonthlyReading> MonthlyReadings => Set<MonthlyReading>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MonthlyReading>()
            .HasIndex(mr => new { mr.ContractId, mr.Month })
            .IsUnique();
    }
}