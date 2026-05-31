using TaskManager.API.DTOs;

namespace TaskManager.API.Services;

public interface IProjectService
{
    Task<IEnumerable<PublicProjectDto>> GetAllProjectsAsync();
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto);
    Task UpdateProjectAsync(int id, CreateProjectDto dto);
    Task DeleteProjectAsync(int id);
}