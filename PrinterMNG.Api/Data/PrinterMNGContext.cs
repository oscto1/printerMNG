using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace PrinterMNG.Api.Data;

public class PrinterMNGContext(DbContextOptions<PrinterMNGContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Printer> Printers => Set<Printer>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<MonthlyReading> MonthlyReadings => Set<MonthlyReading>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Client>()   
            .HasOne(c => c.Admin)
            .WithMany()
            .HasForeignKey(c => c.AdminId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Client>()
            .HasIndex(c => c.AdminId);

        // MAKES MONTH UNIQUE FOR EACH CONTRACTID
        modelBuilder.Entity<MonthlyReading>()
            .HasIndex(mr => new { mr.ContractId, mr.Month })
            .IsUnique();
          
        // PREVENTS A *PRINTER* FROM BEING DELETED IF REFERENCED BY A *CONTRACT*.
        // Deleting a Contract is still allowed.
        modelBuilder.Entity<Contract>()
            .HasOne(c => c.Printer)
            .WithMany()
            .HasForeignKey(c => c.PrinterId)
            .OnDelete(DeleteBehavior.Restrict);

        // PREVENTS A *BRAND* FROM BEING DELETED IF REFERENCED BY A *PRINTER*.
        // Deleting a Contract is still allowed.
        modelBuilder.Entity<Printer>()
            .HasOne(p => p.Brand)
            .WithMany()
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.Restrict);

        // PREVENTS A *CLIENT* FROM BEING DELETED IF REFERENCED BY A *CONTRACT*.
        // Deleting a Contract is still allowed.
        modelBuilder.Entity<Contract>()
            .HasOne(c => c.Client)
            .WithMany()
            .HasForeignKey(c => c.ClientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}