namespace TaskManager.API.Models;

public class ProjectTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, InProgress, Done
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsApproved { get; set; } = false; // daca e false inseamna ca e o sugestie de la user
    public int ProjectId { get; set; }
    public Project? Project { get; set; }

    public int? AssignedUserId { get; set; }
    public User? AssignedUser { get; set; }

    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}