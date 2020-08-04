using Microsoft.EntityFrameworkCore.Migrations;

namespace phase_2_back_end.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pictures",
                columns: table => new
                {
                    PictureID = table.Column<int>(nullable: false)
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
                    RowID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PictureID = table.Column<int>(nullable: true)
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
                    ColumnID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rgb = table.Column<float>(nullable: false),
                    RowID = table.Column<int>(nullable: true)
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Columns");

            migrationBuilder.DropTable(
                name: "Rows");

            migrationBuilder.DropTable(
                name: "Pictures");
        }
    }
}
