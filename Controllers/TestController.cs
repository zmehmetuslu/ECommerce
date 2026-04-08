using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    public IActionResult PublicEndpoint()
    {
        return Ok("This endpoint is public.");
    }

    [Authorize]
    [HttpGet("private")]
    public IActionResult PrivateEndpoint()
    {
        return Ok("You are authenticated. Token is valid.");
    }
}