using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrinterMNG.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class PrinterAndBrandDeletionRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Printers_PrinterId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Printers_Brands_BrandId",
                table: "Printers");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Printers_PrinterId",
                table: "Contracts",
                column: "PrinterId",
                principalTable: "Printers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Printers_Brands_BrandId",
                table: "Printers",
                column: "BrandId",
                principalTable: "Brands",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Printers_PrinterId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Printers_Brands_BrandId",
                table: "Printers");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Printers_PrinterId",
                table: "Contracts",
                column: "PrinterId",
                principalTable: "Printers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Printers_Brands_BrandId",
                table: "Printers",
                column: "BrandId",
                principalTable: "Brands",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
