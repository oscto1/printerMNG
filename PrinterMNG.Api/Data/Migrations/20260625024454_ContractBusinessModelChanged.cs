using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrinterMNG.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class ContractBusinessModelChanged : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IncreasedBlackPrice",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "MinimumBlackCopies",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "MinimumColorCopies",
                table: "Contracts");

            migrationBuilder.RenameColumn(
                name: "NormalColorPrice",
                table: "Contracts",
                newName: "MinimumCharge");

            migrationBuilder.RenameColumn(
                name: "NormalBlackPrice",
                table: "Contracts",
                newName: "ColorCopyPrice");

            migrationBuilder.RenameColumn(
                name: "IncreasedColorPrice",
                table: "Contracts",
                newName: "BlackCopyPrice");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MinimumCharge",
                table: "Contracts",
                newName: "NormalColorPrice");

            migrationBuilder.RenameColumn(
                name: "ColorCopyPrice",
                table: "Contracts",
                newName: "NormalBlackPrice");

            migrationBuilder.RenameColumn(
                name: "BlackCopyPrice",
                table: "Contracts",
                newName: "IncreasedColorPrice");

            migrationBuilder.AddColumn<decimal>(
                name: "IncreasedBlackPrice",
                table: "Contracts",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "MinimumBlackCopies",
                table: "Contracts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MinimumColorCopies",
                table: "Contracts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
