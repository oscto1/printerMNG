using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrinterMNG.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class NewBillDayParameterContracts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BillDay",
                table: "Contracts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillDay",
                table: "Contracts");
        }
    }
}
