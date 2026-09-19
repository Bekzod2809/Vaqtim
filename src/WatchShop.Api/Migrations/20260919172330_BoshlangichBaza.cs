using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WatchShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class BoshlangichBaza : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Foydalanuvchilar",
                columns: table => new
                {
                    FoydalanuvchiId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ism = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Familiya = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ParolHash = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Rol = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Foydalanuvchilar", x => x.FoydalanuvchiId);
                });

            migrationBuilder.CreateTable(
                name: "Mahsulotlar",
                columns: table => new
                {
                    MahsulotId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nomi = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Tavsifi = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Brendi = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Rangi = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Narxi = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ChegirmaNarxi = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    OmbordagiSoni = table.Column<int>(type: "integer", nullable: false),
                    Kategoriya = table.Column<int>(type: "integer", nullable: false),
                    Turi = table.Column<int>(type: "integer", nullable: true),
                    Mexanizmi = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mahsulotlar", x => x.MahsulotId);
                });

            migrationBuilder.CreateTable(
                name: "Buyurtmalar",
                columns: table => new
                {
                    BuyurtmaId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    YetkazishManzili = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    JamiSumma = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Holati = table.Column<int>(type: "integer", nullable: false),
                    YaratilganVaqt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                name: "MahsulotRasmlari",
                columns: table => new
                {
                    MahsulotRasmiId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RasmHavolasi = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    AsosiyRasmmi = table.Column<bool>(type: "boolean", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "SavatMahsulotlari",
                columns: table => new
                {
                    SavatMahsulotiId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Soni = table.Column<int>(type: "integer", nullable: false),
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
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MahsulotNomi = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Narxi = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Soni = table.Column<int>(type: "integer", nullable: false),
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
                name: "IX_Foydalanuvchilar_Email",
                table: "Foydalanuvchilar",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Foydalanuvchilar_Username",
                table: "Foydalanuvchilar",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Mahsulotlar_Kategoriya",
                table: "Mahsulotlar",
                column: "Kategoriya");

            migrationBuilder.CreateIndex(
                name: "IX_MahsulotRasmlari_MahsulotId",
                table: "MahsulotRasmlari",
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
                name: "MahsulotRasmlari");

            migrationBuilder.DropTable(
                name: "SavatMahsulotlari");

            migrationBuilder.DropTable(
                name: "Buyurtmalar");

            migrationBuilder.DropTable(
                name: "Mahsulotlar");

            migrationBuilder.DropTable(
                name: "Foydalanuvchilar");
        }
    }
}
