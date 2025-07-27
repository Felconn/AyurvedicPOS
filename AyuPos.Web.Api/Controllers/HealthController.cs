using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AyuPos.Web.Api.Controllers;

[AllowAnonymous]
public class HealthController : BaseController
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new 
        { 
            status = "healthy", 
            timestamp = DateTime.UtcNow,
            service = "AyuPos.Web.Api"
        });
    }
}