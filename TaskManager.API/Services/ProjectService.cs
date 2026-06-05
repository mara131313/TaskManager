using Microsoft.Extensions.Logging;
using TaskManager.API.DTOs;
using TaskManager.API.Models;
using TaskManager.API.Repositories;

namespace TaskManager.API.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repository;
    private readonly ILogger<ProjectService> _logger;

    public ProjectService(IProjectRepository repository, ILogger<ProjectService> logger)
    {
        _repository = repository;
        _logger = logger;
    }
    public async Task<IEnumerable<PublicProjectDto>> GetAllProjectsAsync()
    {
        _logger.LogInformation("Se preiau toate proiectele cu detalii.");
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
        _logger.LogInformation("Se încearcă crearea unui proiect nou: {ProjectName}", dto.Name);
        var project = new Project { Name = dto.Name, Description = dto.Description };
        await _repository.AddAsync(project);
        await _repository.SaveChangesAsync();

        _logger.LogInformation("Proiectul {ProjectName} a fost creat cu succes și a primit ID-ul {ProjectId}.", project.Name, project.Id);
        return new ProjectDto { Id = project.Id, Name = project.Name, Description = project.Description };
    }

    public async Task UpdateProjectAsync(int id, CreateProjectDto dto)
    {
        _logger.LogInformation("Se încearcă actualizarea proiectului cu ID {ProjectId}.", id);

        var project = await _repository.GetByIdAsync(id);
        if (project == null)
        {
            _logger.LogWarning("Actualizare eșuată. Proiectul cu ID {ProjectId} nu a fost găsit.", id);
            throw new KeyNotFoundException($"Proiectul cu ID {id} nu există.");
        }
        
        project.Name = dto.Name;
        project.Description = dto.Description;
        _repository.Update(project);
        await _repository.SaveChangesAsync();
        
        _logger.LogInformation("Proiectul cu ID {ProjectId} a fost actualizat cu succes.", id);
    }

    public async Task DeleteProjectAsync(int id)
    {
        _logger.LogInformation("Se încearcă ștergerea proiectului cu ID {ProjectId}.", id);

        var project = await _repository.GetByIdAsync(id);
        if (project == null)
        {
            _logger.LogWarning("Ștergere eșuată. Proiectul cu ID {ProjectId} nu a fost găsit.", id);
            throw new KeyNotFoundException($"Proiectul cu ID {id} nu există.");
        }
        
        _repository.Delete(project);
        await _repository.SaveChangesAsync();
        
        _logger.LogInformation("Proiectul cu ID {ProjectId} a fost șters cu succes.", id);
    }
}