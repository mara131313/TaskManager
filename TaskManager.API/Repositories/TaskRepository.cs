using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.Models;

namespace TaskManager.API.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProjectTask>> GetAllAsync()
    {
        return await _context.ProjectTasks.Include(t => t.AssignedUser).ToListAsync();
    }

    public async Task<ProjectTask?> GetByIdAsync(int id)
    {
        return await _context.ProjectTasks.Include(t => t.AssignedUser).FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task AddAsync(ProjectTask task)
    {
        await _context.ProjectTasks.AddAsync(task);
    }

    public void Update(ProjectTask task)
    {
        _context.ProjectTasks.Update(task);
    }

    public void Delete(ProjectTask task)
    {
        _context.ProjectTasks.Remove(task);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}