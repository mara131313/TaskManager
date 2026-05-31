using Microsoft.AspNetCore.Identity;
using TaskManager.API.DTOs;
using TaskManager.API.Models;

namespace TaskManager.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public AuthService(UserManager<User> userManager, SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {
        var user = new User { UserName = dto.Email, Email = dto.Email, FullName = dto.FullName };
        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            // se preia prima eroare generata si se da throw ca ArgumentException
            var firstError = result.Errors.FirstOrDefault()?.Description ?? "Inregistrare esuata.";
            throw new ArgumentException(firstError);
        }

        await _userManager.AddToRoleAsync(user, "User");
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        var result = await _signInManager.PasswordSignInAsync(dto.Email, dto.Password, false, false);
        
        if (!result.Succeeded)
        {
            throw new UnauthorizedAccessException("Email sau parolă incorectă."); // 403
        }

        return "Autentificat cu succes!";
    }
}