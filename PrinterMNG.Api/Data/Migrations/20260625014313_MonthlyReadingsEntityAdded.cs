using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrinterMNG.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class MonthlyReadingsEntityAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContractPdfPath",
                table: "Contracts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MonthlyReadings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractId = table.Column<int>(type: "INTEGER", nullable: false),
                    Month = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    ColorCounter = table.Column<int>(type: "INTEGER", nullable: false),
                    BlackCounter = table.Column<int>(type: "INTEGER", nullable: false),
                    BlackCopiesUsed = table.Column<int>(type: "INTEGER", nullable: false),
                    ColorCopiesUsed = table.Column<int>(type: "INTEGER", nullable: false),
                    BlackCharge = table.Column<decimal>(type: "TEXT", nullable: false),
                    ColorCharge = table.Column<decimal>(type: "TEXT", nullable: false),
                    TotalCharge = table.Column<decimal>(type: "TEXT", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
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
                name: "IX_MonthlyReadings_ContractId_Month",
                table: "MonthlyReadings",
                columns: new[] { "ContractId", "Month" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MonthlyReadings");

            migrationBuilder.DropColumn(
                name: "ContractPdfPath",
                table: "Contracts");
        }
    }
}
