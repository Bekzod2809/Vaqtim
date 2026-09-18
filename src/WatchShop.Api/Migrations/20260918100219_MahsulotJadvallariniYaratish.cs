using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class MahsulotJadvallariniYaratish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Mahsulotlar",
                columns: table => new
                {
                    MahsulotId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nomi = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Tavsifi = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Brendi = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Rangi = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Narxi = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ChegirmaNarxi = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Kategoriya = table.Column<int>(type: "int", nullable: false),
                    Turi = table.Column<int>(type: "int", nullable: true),
                    Mexanizmi = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mahsulotlar", x => x.MahsulotId);
                });

            migrationBuilder.CreateTable(
                name: "MahsulotRasmlari",
                columns: table => new
                {
                    MahsulotRasmiId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RasmHavolasi = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    AsosiyRasmmi = table.Column<bool>(type: "bit", nullable: false),
                    MahsulotId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MahsulotRasmlari", x => x.MahsulotRasmiId);
                    table.ForeignKey(
                        name: "FK_MahsulotRasmlari_Mahsulotlar_MahsulotId",
                        column: x => x.MahsulotId,
                        principalTable: "Mahsulotlar",
                        principalColumn: "MahsulotId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Mahsulotlar_Kategoriya",
                table: "Mahsulotlar",
                column: "Kategoriya");

            migrationBuilder.CreateIndex(
                name: "IX_MahsulotRasmlari_MahsulotId",
                table: "MahsulotRasmlari",
                column: "MahsulotId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MahsulotRasmlari");

            migrationBuilder.DropTable(
                name: "Mahsulotlar");
        }
    }
}
