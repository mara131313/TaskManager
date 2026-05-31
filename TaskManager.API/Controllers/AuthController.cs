using Microsoft.AspNetCore.Mvc;
using TaskManager.API.DTOs;
using TaskManager.API.Services;
using Microsoft.AspNetCore.Identity;
using TaskManager.API.Models;


namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly UserManager<User> _userManager;

    public AuthController(IAuthService authService, UserManager<User> userManager)
    {
        _authService = authService;
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        await _authService.RegisterAsync(dto);
        return Ok(new { message = "Inregistrare reusita!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);
    
        string role = "User";

        if (dto.Email == "admin@test.com")
        {
            role = "Admin";
        
            // Căutăm userul în baza de date Identity
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user != null)
            {
                // Verificăm dacă are deja rolul de Admin în DB, dacă nu, îl adăugăm pe loc
                var hasRole = await _userManager.IsInRoleAsync(user, "Admin");
                if (!hasRole)
                {
                    await _userManager.AddToRoleAsync(user, "Admin");
                }
            }
        }
        return Ok(new { 
            token = token, 
            role = role, 
            email = dto.Email 
        });
    }
}