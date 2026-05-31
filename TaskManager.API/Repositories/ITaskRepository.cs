using TaskManager.API.Models;

namespace TaskManager.API.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<ProjectTask>> GetAllAsync();
    Task<ProjectTask?> GetByIdAsync(int id);
    Task AddAsync(ProjectTask task);
    void Update(ProjectTask task);
    void Delete(ProjectTask task);
    Task<bool> SaveChangesAsync();
}