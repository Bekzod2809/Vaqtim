using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class FoydalanuvchilarJadvaliniQoshish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Foydalanuvchilar",
                columns: table => new
                {
                    FoydalanuvchiId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ism = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Familiya = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ParolHash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Rol = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Foydalanuvchilar", x => x.FoydalanuvchiId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Foydalanuvchilar_Email",
                table: "Foydalanuvchilar",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Foydalanuvchilar_Username",
                table: "Foydalanuvchilar",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Foydalanuvchilar");
        }
    }
}
