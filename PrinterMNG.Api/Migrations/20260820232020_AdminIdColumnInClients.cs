using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrinterMNG.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdminIdColumnInClients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminId",
                table: "Clients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_AdminId",
                table: "Clients",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_AspNetUsers_AdminId",
                table: "Clients",
                column: "AdminId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_AspNetUsers_AdminId",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Clients_AdminId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "AdminId",
                table: "Clients");
        }
    }
}
