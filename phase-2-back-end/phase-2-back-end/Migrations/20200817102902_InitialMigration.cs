using Microsoft.EntityFrameworkCore.Migrations;

namespace phase_2_back_end.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Canvas",
                columns: table => new
                {
                    CanvasID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Canvas", x => x.CanvasID);
                });

            migrationBuilder.CreateTable(
                name: "ColorData",
                columns: table => new
                {
                    ColorDataID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RowIndex = table.Column<int>(nullable: false),
                    ColumnIndex = table.Column<int>(nullable: false),
                    Hex = table.Column<string>(nullable: false),
                    CanvasID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColorData", x => x.ColorDataID);
                    table.ForeignKey(
                        name: "FK_ColorData_Canvas_CanvasID",
                        column: x => x.CanvasID,
                        principalTable: "Canvas",
                        principalColumn: "CanvasID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ColorData_CanvasID",
                table: "ColorData",
                column: "CanvasID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ColorData");

            migrationBuilder.DropTable(
                name: "Canvas");
        }
    }
}
