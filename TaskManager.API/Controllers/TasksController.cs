using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.DTOs;
using TaskManager.API.Services;
using System.Security.Claims;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService) => _taskService = taskService;

    [HttpGet] // GET /api/tasks - necesita autentificare
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _taskService.GetAllTasksAsync());
    }

    [HttpGet("{id}")] // GET /api/tasks/{id} - necesita autentificare
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _taskService.GetTaskByIdAsync(id));
    }

    [HttpPost] // POST /api/tasks - doar adminul adauga direct task uri oficiale
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateTaskDto dto)
    {
        var createdTask = await _taskService.CreateTaskAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
    }

    [HttpPost("suggest")] // POST /api/tasks/suggest - orice user logat poate trimite o sugestie
    [Authorize]
    public async Task<IActionResult> Suggest(CreateTaskDto dto)
    {
        await _taskService.UserSuggestTaskAsync(dto);
        return Ok(new { message = "Sugestia a fost trimisă pentru aprobare." });
    }

    [HttpPut("user-update/{id}")] // PUT /api/tasks/user-update/{id} - userul modifica doar descrierea/statusul
    [Authorize]
    public async Task<IActionResult> UserUpdate(int id, UserUpdateTaskDto dto)
    {
        var currentUserEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

        try
        {
            await _taskService.UserUpdateTaskAsync(id, dto, currentUserEmail, currentUserRole);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("admin-update/{id}")] // PUT /api/tasks/admin-update/{id} - adminul controleaza tot
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AdminUpdate(int id, AdminTaskDto dto)
    {
        await _taskService.AdminUpdateTaskAsync(id, dto);
        return NoContent();
    }

    [HttpPost("approve/{id}")] // POST /api/tasks/approve/{id} - adminul aproba
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(int id)
    {
        await _taskService.AdminApproveTaskAsync(id);
        return Ok(new { message = "Task aprobat cu succes." });
    }

    [HttpDelete("{id}")] // DELETE /api/tasks/{id} - doar admin
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _taskService.DeleteTaskAsync(id);
        return NoContent();
    }
}