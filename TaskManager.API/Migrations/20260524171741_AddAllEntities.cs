using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TaskManager.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAllEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_project_tasks_users_user_id",
                table: "project_tasks");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "project_tasks",
                newName: "assigned_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_project_tasks_user_id",
                table: "project_tasks",
                newName: "ix_project_tasks_assigned_user_id");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "project_tasks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "project_id",
                table: "project_tasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "components",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_components", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "projects",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_projects", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_project_tasks_project_id",
                table: "project_tasks",
                column: "project_id");

            migrationBuilder.AddForeignKey(
                name: "fk_project_tasks_projects_project_id",
                table: "project_tasks",
                column: "project_id",
                principalTable: "projects",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_project_tasks_users_assigned_user_id",
                table: "project_tasks",
                column: "assigned_user_id",
                principalTable: "AspNetUsers",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_project_tasks_projects_project_id",
                table: "project_tasks");

            migrationBuilder.DropForeignKey(
                name: "fk_project_tasks_users_assigned_user_id",
                table: "project_tasks");

            migrationBuilder.DropTable(
                name: "components");

            migrationBuilder.DropTable(
                name: "projects");

            migrationBuilder.DropIndex(
                name: "ix_project_tasks_project_id",
                table: "project_tasks");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "project_tasks");

            migrationBuilder.DropColumn(
                name: "project_id",
                table: "project_tasks");

            migrationBuilder.RenameColumn(
                name: "assigned_user_id",
                table: "project_tasks",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "ix_project_tasks_assigned_user_id",
                table: "project_tasks",
                newName: "ix_project_tasks_user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_project_tasks_users_user_id",
                table: "project_tasks",
                column: "user_id",
                principalTable: "AspNetUsers",
                principalColumn: "id");
        }
    }
}
