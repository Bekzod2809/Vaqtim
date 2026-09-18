using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class SavatBuyurtmaVaOmbor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OmbordagiSoni",
                table: "Mahsulotlar",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Buyurtmalar",
                columns: table => new
                {
                    BuyurtmaId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    YetkazishManzili = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Telefon = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    JamiSumma = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Holati = table.Column<int>(type: "int", nullable: false),
                    YaratilganVaqt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FoydalanuvchiId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buyurtmalar", x => x.BuyurtmaId);
                    table.ForeignKey(
                        name: "FK_Buyurtmalar_Foydalanuvchilar_FoydalanuvchiId",
                        column: x => x.FoydalanuvchiId,
                        principalTable: "Foydalanuvchilar",
                        principalColumn: "FoydalanuvchiId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SavatMahsulotlari",
                columns: table => new
                {
                    SavatMahsulotiId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Soni = table.Column<int>(type: "int", nullable: false),
                    FoydalanuvchiId = table.Column<long>(type: "bigint", nullable: false),
                    MahsulotId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavatMahsulotlari", x => x.SavatMahsulotiId);
                    table.ForeignKey(
                        name: "FK_SavatMahsulotlari_Foydalanuvchilar_FoydalanuvchiId",
                        column: x => x.FoydalanuvchiId,
                        principalTable: "Foydalanuvchilar",
                        principalColumn: "FoydalanuvchiId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavatMahsulotlari_Mahsulotlar_MahsulotId",
                        column: x => x.MahsulotId,
                        principalTable: "Mahsulotlar",
                        principalColumn: "MahsulotId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BuyurtmaMahsulotlari",
                columns: table => new
                {
                    BuyurtmaMahsulotiId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MahsulotNomi = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Narxi = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Soni = table.Column<int>(type: "int", nullable: false),
                    BuyurtmaId = table.Column<long>(type: "bigint", nullable: false),
                    MahsulotId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuyurtmaMahsulotlari", x => x.BuyurtmaMahsulotiId);
                    table.ForeignKey(
                        name: "FK_BuyurtmaMahsulotlari_Buyurtmalar_BuyurtmaId",
                        column: x => x.BuyurtmaId,
                        principalTable: "Buyurtmalar",
                        principalColumn: "BuyurtmaId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BuyurtmaMahsulotlari_Mahsulotlar_MahsulotId",
                        column: x => x.MahsulotId,
                        principalTable: "Mahsulotlar",
                        principalColumn: "MahsulotId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Buyurtmalar_FoydalanuvchiId",
                table: "Buyurtmalar",
                column: "FoydalanuvchiId");

            migrationBuilder.CreateIndex(
                name: "IX_BuyurtmaMahsulotlari_BuyurtmaId",
                table: "BuyurtmaMahsulotlari",
                column: "BuyurtmaId");

            migrationBuilder.CreateIndex(
                name: "IX_BuyurtmaMahsulotlari_MahsulotId",
                table: "BuyurtmaMahsulotlari",
                column: "MahsulotId");

            migrationBuilder.CreateIndex(
                name: "IX_SavatMahsulotlari_FoydalanuvchiId_MahsulotId",
                table: "SavatMahsulotlari",
                columns: new[] { "FoydalanuvchiId", "MahsulotId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SavatMahsulotlari_MahsulotId",
                table: "SavatMahsulotlari",
                column: "MahsulotId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuyurtmaMahsulotlari");

            migrationBuilder.DropTable(
                name: "SavatMahsulotlari");

            migrationBuilder.DropTable(
                name: "Buyurtmalar");

            migrationBuilder.DropColumn(
                name: "OmbordagiSoni",
                table: "Mahsulotlar");
        }
    }
}
