using Microsoft.AspNetCore.Mvc;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetTags() 
    {
        var tags = new[] { "Urgent", "Hardware", "Testing" };
        return Ok(tags); // 200 cu json-ul etichetelor
    }
}