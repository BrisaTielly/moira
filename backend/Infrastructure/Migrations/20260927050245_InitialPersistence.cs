using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Moira.Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialPersistence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "cards",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Meaning = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cards", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "temporary_users",
                columns: table => new
                {
                    SessionId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    UserName = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_temporary_users", x => x.SessionId);
                });

            migrationBuilder.CreateTable(
                name: "draws",
                columns: table => new
                {
                    ReadingId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    SessionId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Question = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_draws", x => x.ReadingId);
                    table.ForeignKey(
                        name: "FK_draws_temporary_users_SessionId",
                        column: x => x.SessionId,
                        principalTable: "temporary_users",
                        principalColumn: "SessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "drawn_cards",
                columns: table => new
                {
                    ReadingId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    CardId = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_drawn_cards", x => new { x.ReadingId, x.Order });
                    table.ForeignKey(
                        name: "FK_drawn_cards_cards_CardId",
                        column: x => x.CardId,
                        principalTable: "cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_drawn_cards_draws_ReadingId",
                        column: x => x.ReadingId,
                        principalTable: "draws",
                        principalColumn: "ReadingId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "cards",
                columns: new[] { "Id", "Meaning", "Name" },
                values: new object[,]
                {
                    { "star", "Esperança e renovação: um caminho mais leve se abre à sua frente.", "A Estrela" },
                    { "strength", "Coragem serena para enfrentar o que pesa.", "A Força" },
                    { "world", "Ciclo completo: aquilo que você buscou encontra realização.", "O Mundo" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_drawn_cards_CardId",
                table: "drawn_cards",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_draws_SessionId",
                table: "draws",
                column: "SessionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "drawn_cards");

            migrationBuilder.DropTable(
                name: "cards");

            migrationBuilder.DropTable(
                name: "draws");

            migrationBuilder.DropTable(
                name: "temporary_users");
        }
    }
}
