using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelsForPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_approved",
                table: "project_tasks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "project_id",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_users_project_id",
                table: "AspNetUsers",
                column: "project_id");

            migrationBuilder.AddForeignKey(
                name: "fk_asp_net_users_projects_project_id",
                table: "AspNetUsers",
                column: "project_id",
                principalTable: "projects",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_asp_net_users_projects_project_id",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "ix_asp_net_users_project_id",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "is_approved",
                table: "project_tasks");

            migrationBuilder.DropColumn(
                name: "project_id",
                table: "AspNetUsers");
        }
    }
}
