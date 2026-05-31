using Microsoft.AspNetCore.Identity;

namespace TaskManager.API.Models;

public class User : IdentityUser<int>
{
    public string FullName { get; set; } = string.Empty;
    
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    public int? ProjectId { get; set; }
    public Project? Project { get; set; }
}