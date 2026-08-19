using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PrinterMNG.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Document = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Printers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BrandId = table.Column<int>(type: "integer", nullable: false),
                    Model = table.Column<string>(type: "text", nullable: false),
                    IsColorPrinter = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Printers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Printers_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Contracts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    ClientId = table.Column<int>(type: "integer", nullable: false),
                    PrinterId = table.Column<int>(type: "integer", nullable: false),
                    ContractPdfPath = table.Column<string>(type: "text", nullable: true),
                    BlackCopyPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    ColorCopyPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    MinimumCharge = table.Column<decimal>(type: "numeric", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    BillDay = table.Column<int>(type: "integer", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contracts_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Contracts_Printers_PrinterId",
                        column: x => x.PrinterId,
                        principalTable: "Printers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MonthlyReadings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ContractId = table.Column<int>(type: "integer", nullable: false),
                    Month = table.Column<DateOnly>(type: "date", nullable: false),
                    ColorCounter = table.Column<int>(type: "integer", nullable: false),
                    BlackCounter = table.Column<int>(type: "integer", nullable: false),
                    BlackCopiesUsed = table.Column<int>(type: "integer", nullable: false),
                    ColorCopiesUsed = table.Column<int>(type: "integer", nullable: false),
                    BlackCharge = table.Column<decimal>(type: "numeric", nullable: false),
                    ColorCharge = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalCharge = table.Column<decimal>(type: "numeric", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonthlyReadings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MonthlyReadings_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_ClientId",
                table: "Contracts",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_PrinterId",
                table: "Contracts",
                column: "PrinterId");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyReadings_ContractId_Month",
                table: "MonthlyReadings",
                columns: new[] { "ContractId", "Month" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Printers_BrandId",
                table: "Printers",
                column: "BrandId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MonthlyReadings");

            migrationBuilder.DropTable(
                name: "Contracts");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Printers");

            migrationBuilder.DropTable(
                name: "Brands");
        }
    }
}
