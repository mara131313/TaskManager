using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using TaskManager.API.DTOs;
using TaskManager.API.Models;

namespace TaskManager.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ILogger<AuthService> _logger;
    
    public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {
        _logger.LogInformation("Se încearcă înregistrarea unui utilizator nou cu email-ul: {Email}", dto.Email);
        
        var user = new User { UserName = dto.Email, Email = dto.Email, FullName = dto.FullName };
        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            // se preia prima eroare generata si se da throw ca ArgumentException
            var firstError = result.Errors.FirstOrDefault()?.Description ?? "Inregistrare esuata.";
            _logger.LogWarning("Înregistrare eșuată pentru {Email}. Motiv: {Error}", dto.Email, firstError);
            throw new ArgumentException(firstError);
        }

        await _userManager.AddToRoleAsync(user, "User");
        _logger.LogInformation("Utilizatorul cu email-ul {Email} a fost înregistrat cu succes și a primit rolul 'User'.", dto.Email);
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        _logger.LogInformation("Se încearcă autentificarea pentru email-ul: {Email}", dto.Email);
        var result = await _signInManager.PasswordSignInAsync(dto.Email, dto.Password, false, false);
        
        if (!result.Succeeded)
        {
            _logger.LogWarning("Tentativă de autentificare eșuată pentru email-ul: {Email}", dto.Email);
            throw new UnauthorizedAccessException("Email sau parolă incorectă."); // 403
        }

        _logger.LogInformation("Utilizatorul {Email} s-a autentificat cu succes.", dto.Email);
        return "Autentificat cu succes!";
    }
}