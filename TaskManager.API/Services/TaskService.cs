using TaskManager.API.DTOs;
using TaskManager.API.Models;
using TaskManager.API.Repositories;

namespace TaskManager.API.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;
    private readonly ILogger<TaskService> _logger;

    public TaskService(ITaskRepository repository, ILogger<TaskService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<IEnumerable<TaskDto>> GetAllTasksAsync()
    {
        _logger.LogInformation("Preluarea tuturor task-urilor.");
        var tasks = await _repository.GetAllAsync();
        return tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            ProjectId = t.ProjectId,
            AssignedTo = t.AssignedUser?.FullName,
            IsApproved = t.IsApproved
        });
    }

    public async Task<TaskDto> GetTaskByIdAsync(int id)
    {
        var t = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Task-ul cu ID-ul {id} nu exista.");
        return new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            ProjectId = t.ProjectId,
            AssignedTo = t.AssignedUser?.FullName,
            IsApproved = t.IsApproved
        };
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto dto)
    {
        var task = new ProjectTask
        {
            Title = dto.Title,
            Description = dto.Description,
            ProjectId = dto.ProjectId,
            Status = "Pending",
            IsApproved = true // adminul adauga direct aprobat
        };
        await _repository.AddAsync(task);
        await _repository.SaveChangesAsync();

        return new TaskDto { Id = task.Id, Title = task.Title, Description = task.Description, Status = task.Status, ProjectId = task.ProjectId, IsApproved = true };
    }

    public async Task UserSuggestTaskAsync(CreateTaskDto dto)
    {
        var task = new ProjectTask
        {
            Title = dto.Title,
            Description = dto.Description,
            ProjectId = dto.ProjectId,
            Status = "Pending",
            IsApproved = false // sugestia are nevoie de aprobarea adminului
        };
        await _repository.AddAsync(task);
        await _repository.SaveChangesAsync();
    }

    public async Task UserUpdateTaskAsync(int id, UserUpdateTaskDto dto, string currentUserEmail, string currentUserRole)
    {
        var task = await _repository.GetByIdAsync(id) 
            ?? throw new KeyNotFoundException($"Task-ul {id} nu există.");

        if (!task.IsApproved) 
            throw new UnauthorizedAccessException("Nu puteți modifica un task care nu este aprobat.");

        var validStatuses = new[] { "Pending", "InProgress", "Done" };
        if (!validStatuses.Contains(dto.Status)) 
            throw new ArgumentException("Status invalid.");

        if (currentUserRole == "User")
        {
            bool esteTaskulLuiInregistrat = task.AssignedUser != null && 
                string.Equals(task.AssignedUser.Email?.Trim(), currentUserEmail?.Trim(), StringComparison.OrdinalIgnoreCase);

            bool estePotrivireNumeText = task.AssignedUser != null &&
                string.Equals(task.AssignedUser.FullName?.Trim(), dto.Description?.Trim(), StringComparison.OrdinalIgnoreCase);

            if (!esteTaskulLuiInregistrat)
            {
                throw new UnauthorizedAccessException("Acces refuzat! Puteți modifica statusul doar pentru task-urile care vă sunt repartizate dumneavoastră.");
            }

            task.Status = dto.Status;
        }
        else if (currentUserRole == "Admin")
        {
            task.Description = dto.Description;
            task.Status = dto.Status;
        }

        _repository.Update(task);
        await _repository.SaveChangesAsync();
    }

    public async Task AdminUpdateTaskAsync(int id, AdminTaskDto dto)
    {
        var task = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Task-ul {id} nu există.");
        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Status = dto.Status;
        task.AssignedUserId = dto.AssignedUserId;
        task.IsApproved = dto.IsApproved;
        _repository.Update(task);
        await _repository.SaveChangesAsync();
    }

    public async Task AdminApproveTaskAsync(int id)
    {
        var task = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Task-ul {id} nu există.");
        task.IsApproved = true;
        _repository.Update(task);
        await _repository.SaveChangesAsync();
    }

    public async Task DeleteTaskAsync(int id)
    {
        var task = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Task-ul {id} nu există.");
        _repository.Delete(task);
        await _repository.SaveChangesAsync();
    }
}