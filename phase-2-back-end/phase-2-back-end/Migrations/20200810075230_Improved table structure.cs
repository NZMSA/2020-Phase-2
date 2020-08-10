using Microsoft.EntityFrameworkCore.Migrations;

namespace phase_2_back_end.Migrations
{
    public partial class Improvedtablestructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Columns");

            migrationBuilder.DropTable(
                name: "Rows");

            migrationBuilder.DropTable(
                name: "Pictures");

            migrationBuilder.CreateTable(
                name: "Canvas",
                columns: table => new
                {
                    PictureID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Canvas", x => x.PictureID);
                });

            migrationBuilder.CreateTable(
                name: "Matrices",
                columns: table => new
                {
                    RowID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Row = table.Column<int>(nullable: false),
                    Column = table.Column<int>(nullable: false),
                    Hex = table.Column<string>(nullable: false),
                    CanvasPictureID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matrices", x => x.RowID);
                    table.ForeignKey(
                        name: "FK_Matrices_Canvas_CanvasPictureID",
                        column: x => x.CanvasPictureID,
                        principalTable: "Canvas",
                        principalColumn: "PictureID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Matrices_CanvasPictureID",
                table: "Matrices",
                column: "CanvasPictureID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Matrices");

            migrationBuilder.DropTable(
                name: "Canvas");

            migrationBuilder.CreateTable(
                name: "Pictures",
                columns: table => new
                {
                    PictureID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pictures", x => x.PictureID);
                });

            migrationBuilder.CreateTable(
                name: "Rows",
                columns: table => new
                {
                    RowID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PictureID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rows", x => x.RowID);
                    table.ForeignKey(
                        name: "FK_Rows_Pictures_PictureID",
                        column: x => x.PictureID,
                        principalTable: "Pictures",
                        principalColumn: "PictureID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Columns",
                columns: table => new
                {
                    ColumnID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RowID = table.Column<int>(type: "int", nullable: true),
                    rgb = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Columns", x => x.ColumnID);
                    table.ForeignKey(
                        name: "FK_Columns_Rows_RowID",
                        column: x => x.RowID,
                        principalTable: "Rows",
                        principalColumn: "RowID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Columns_RowID",
                table: "Columns",
                column: "RowID");

            migrationBuilder.CreateIndex(
                name: "IX_Rows_PictureID",
                table: "Rows",
                column: "PictureID");
        }
    }
}
