using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrinterMNG.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdminIdInPrinters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminId",
                table: "Printers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Printers_AdminId",
                table: "Printers",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Printers_AspNetUsers_AdminId",
                table: "Printers",
                column: "AdminId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Printers_AspNetUsers_AdminId",
                table: "Printers");

            migrationBuilder.DropIndex(
                name: "IX_Printers_AdminId",
                table: "Printers");

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "Printers");
        }
    }
}
