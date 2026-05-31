using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.DTOs;
using TaskManager.API.Services;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService) => _projectService = projectService;

    [HttpGet] // GET /api/projects - toti
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _projectService.GetAllProjectsAsync());
    }

    [HttpPost] // POST /api/projects - doar admin
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateProjectDto dto)
    {
        var createdProject = await _projectService.CreateProjectAsync(dto);
        return CreatedAtAction(nameof(GetAll), createdProject);
    }

    [HttpPut("{id}")] // PUT /api/projects/{id} - doar admin
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, CreateProjectDto dto)
    {
        await _projectService.UpdateProjectAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")] // DELETE /api/projects/{id} - doar admin
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _projectService.DeleteProjectAsync(id);
        return NoContent();
    }
}