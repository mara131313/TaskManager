using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context) => _context = context;

    [HttpGet] // doar userii autentificați pot vedea echipa completa 
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.Select(u => new { u.Id, u.FullName, u.Email }).ToListAsync();
        return Ok(users);
    }
}