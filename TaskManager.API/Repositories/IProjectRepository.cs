using TaskManager.API.Models;

namespace TaskManager.API.Repositories;

public interface IProjectRepository
{
    Task<IEnumerable<Project>> GetAllWithDetailsAsync();
    Task<Project?> GetByIdAsync(int id);
    Task AddAsync(Project project);
    void Update(Project project);
    void Delete(Project project);
    Task<bool> SaveChangesAsync();
}