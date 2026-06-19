using Microsoft.EntityFrameworkCore;
using PrinterMNG.Api.Models;


namespace PrinterMNG.Api.Data;

public class PrinterMNGContext(DbContextOptions<PrinterMNGContext> options) : DbContext(options)
{
    public DbSet<Printer> Printers => Set<Printer>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Client> Clients => Set<Client>();
}