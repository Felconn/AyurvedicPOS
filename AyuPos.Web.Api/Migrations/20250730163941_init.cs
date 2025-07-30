using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AyuPos.Web.Api.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Identity365Role",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identity365Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Identity365UserPersonalData",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Nic = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identity365UserPersonalData", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Identity365RoleClaim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identity365RoleClaim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Identity365RoleClaim_Identity365Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Identity365Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Identity365User",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    LastSignInAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeactivated = table.Column<bool>(type: "boolean", nullable: false),
                    InvitedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UserPersonalDataId = table.Column<string>(type: "character varying(450)", nullable: true),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identity365User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Identity365User_Identity365UserPersonalData_UserPersonalDat~",
                        column: x => x.UserPersonalDataId,
                        principalTable: "Identity365UserPersonalData",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Identity365UserClaim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identity365UserClaim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Identity365UserClaim_Identity365User_UserId",
                        column: x => x.UserId,
                        principalTable: "Identity365User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Identity365UserLogin",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identity365UserLogin", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_Identity365UserLogin_Identity365User_UserId",
                        column: x => x.UserId,
                        principalTable: "Identity365User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Identity365UserRole",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identity365UserRole", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_Identity365UserRole_Identity365Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Identity365Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Identity365UserRole_Identity365User_UserId",
                        column: x => x.UserId,
                        principalTable: "Identity365User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Identity365UserToken",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Identity365UserToken", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_Identity365UserToken_Identity365User_UserId",
                        column: x => x.UserId,
                        principalTable: "Identity365User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Identity365Role",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identity365RoleClaim_RoleId",
                table: "Identity365RoleClaim",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "Identity365User",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Identity365User_UserPersonalDataId",
                table: "Identity365User",
                column: "UserPersonalDataId");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Identity365User",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Identity365UserClaim_UserId",
                table: "Identity365UserClaim",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Identity365UserLogin_UserId",
                table: "Identity365UserLogin",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Identity365UserRole_RoleId",
                table: "Identity365UserRole",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Identity365RoleClaim");

            migrationBuilder.DropTable(
                name: "Identity365UserClaim");

            migrationBuilder.DropTable(
                name: "Identity365UserLogin");

            migrationBuilder.DropTable(
                name: "Identity365UserRole");

            migrationBuilder.DropTable(
                name: "Identity365UserToken");

            migrationBuilder.DropTable(
                name: "Identity365Role");

            migrationBuilder.DropTable(
                name: "Identity365User");

            migrationBuilder.DropTable(
                name: "Identity365UserPersonalData");
        }
    }
}
