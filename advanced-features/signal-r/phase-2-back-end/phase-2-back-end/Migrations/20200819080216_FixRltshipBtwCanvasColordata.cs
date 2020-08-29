using Microsoft.EntityFrameworkCore.Migrations;

namespace phase_2_back_end.Migrations
{
    public partial class FixRltshipBtwCanvasColordata : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ColorData_Canvas_CanvasID",
                table: "ColorData");

            migrationBuilder.AlterColumn<int>(
                name: "CanvasID",
                table: "ColorData",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Canvas",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "Canvas",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_ColorData_Canvas_CanvasID",
                table: "ColorData",
                column: "CanvasID",
                principalTable: "Canvas",
                principalColumn: "CanvasID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ColorData_Canvas_CanvasID",
                table: "ColorData");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Canvas");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "Canvas");

            migrationBuilder.AlterColumn<int>(
                name: "CanvasID",
                table: "ColorData",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_ColorData_Canvas_CanvasID",
                table: "ColorData",
                column: "CanvasID",
                principalTable: "Canvas",
                principalColumn: "CanvasID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
