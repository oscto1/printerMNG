using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrinterMNG.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class ContractsEntityAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Contracts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    ClientId = table.Column<int>(type: "INTEGER", nullable: false),
                    PrinterId = table.Column<int>(type: "INTEGER", nullable: false),
                    MinimumBlackCopies = table.Column<int>(type: "INTEGER", nullable: false),
                    MinimumColorCopies = table.Column<int>(type: "INTEGER", nullable: false),
                    NormalBlackPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    NormalColorPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    IncreasedBlackPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    IncreasedColorPrice = table.Column<decimal>(type: "TEXT", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contracts_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Contracts_Printers_PrinterId",
                        column: x => x.PrinterId,
                        principalTable: "Printers",
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Contracts");
        }
    }
}
