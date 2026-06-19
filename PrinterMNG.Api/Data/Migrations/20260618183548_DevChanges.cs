using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrinterMNG.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class DevChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Printers_BrandId",
                table: "Printers",
                column: "BrandId");

            migrationBuilder.AddForeignKey(
                name: "FK_Printers_Brands_BrandId",
                table: "Printers",
                column: "BrandId",
                principalTable: "Brands",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Printers_Brands_BrandId",
                table: "Printers");

            migrationBuilder.DropIndex(
                name: "IX_Printers_BrandId",
                table: "Printers");
        }
    }
}
