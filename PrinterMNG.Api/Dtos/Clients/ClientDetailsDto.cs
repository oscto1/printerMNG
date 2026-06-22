namespace PrinterMNG.Api.Dtos.Clients;

public record ClientDetailsDto(
    int Id,
    string Document,
    string Name,
    string Phone,
    string Location,
    DateTime CreatedAt
);