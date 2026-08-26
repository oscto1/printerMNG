FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["PrinterMNG.Api.csproj", "./"]
RUN dotnet restore "PrinterMNG.Api.csproj"

COPY . .
RUN dotnet publish "PrinterMNG.Api.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "PrinterMNG.Api.dll"]