using Microsoft.EntityFrameworkCore.Migrations;

namespace phase_2_back_end.Migrations
{
    public partial class RemovedSomeFieldsFromCanvasTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Canvas");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "Canvas");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Canvas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "Canvas",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
