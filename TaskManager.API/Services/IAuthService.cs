using TaskManager.API.DTOs;

namespace TaskManager.API.Services;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);
    Task<string> LoginAsync(LoginDto dto);
}