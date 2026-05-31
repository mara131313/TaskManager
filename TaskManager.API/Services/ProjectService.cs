using TaskManager.API.DTOs;
using TaskManager.API.Models;
using TaskManager.API.Repositories;

namespace TaskManager.API.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repository;

    public ProjectService(IProjectRepository repository) => _repository = repository;

    public async Task<IEnumerable<PublicProjectDto>> GetAllProjectsAsync()
    {
        var projects = await _repository.GetAllWithDetailsAsync();
        return projects.Select(p => new PublicProjectDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Team = p.TeamMembers.Select(tm => new TeamMemberDto { Id = tm.Id, FullName = tm.FullName }).ToList(),
            ProjectTags = p.Tasks.SelectMany(t => t.Tags).Select(tag => tag.Name).Distinct().ToList()
        });
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto)
    {
        var project = new Project { Name = dto.Name, Description = dto.Description };
        await _repository.AddAsync(project);
        await _repository.SaveChangesAsync();

        return new ProjectDto { Id = project.Id, Name = project.Name, Description = project.Description };
    }

    public async Task UpdateProjectAsync(int id, CreateProjectDto dto)
    {
        var project = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Proiectul cu ID {id} nu există.");
        project.Name = dto.Name;
        project.Description = dto.Description;
        _repository.Update(project);
        await _repository.SaveChangesAsync();
    }

    public async Task DeleteProjectAsync(int id)
    {
        var project = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Proiectul cu ID {id} nu există.");
        _repository.Delete(project);
        await _repository.SaveChangesAsync();
    }
}