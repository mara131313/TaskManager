using System.ComponentModel.DataAnnotations;

namespace TaskManager.API.DTOs;

public class PublicProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> ProjectTags { get; set; } = new List<string>(); // toate tag-urile folosite intr un proiect
    public List<TeamMemberDto> Team { get; set; } = new List<TeamMemberDto>();
}

public class TeamMemberDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
}
public class CreateProjectDto
{
    [Required(ErrorMessage = "Numele proiectului este obligatoriu")]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; 
    public string Description { get; set; } = string.Empty;
}
