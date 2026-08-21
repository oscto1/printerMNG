namespace PrinterMNG.Api.Models;

public class Client
{
    public int Id {get; set;}
    public required string Document {get; set;}

    public required string Name {get; set;}

    public required string Phone {get; set;}

    public required string Location {get; set;}

    public DateTime CreatedAt {get; set;}

    public string AdminId {get; set;} = string.Empty;

    public ApplicationUser Admin {get; set;} = null!;
}