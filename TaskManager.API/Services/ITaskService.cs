using TaskManager.API.DTOs;

namespace TaskManager.API.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetAllTasksAsync();
    Task<TaskDto> GetTaskByIdAsync(int id);
    Task<TaskDto> CreateTaskAsync(CreateTaskDto dto);
    Task UserSuggestTaskAsync(CreateTaskDto dto);
    Task UserUpdateTaskAsync(int id, UserUpdateTaskDto dto, string currentUserEmail, string currentUserRole);
    Task AdminUpdateTaskAsync(int id, AdminTaskDto dto);
    Task AdminApproveTaskAsync(int id);
    Task DeleteTaskAsync(int id);
}