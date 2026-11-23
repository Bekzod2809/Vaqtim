using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WatchShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderAdditionalPhone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalPhone",
                table: "Orders",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalPhone",
                table: "Orders");
        }
    }
}
