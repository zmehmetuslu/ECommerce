using Microsoft.AspNetCore.Mvc;
using ECommerceAPI.DTOs;
using ECommerceAPI.Entities;
using ECommerceAPI.Services;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;

    public AuthController(UserService userService)
    {
        _userService = userService;
    }

    // REGISTER
    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            Password = dto.Password
        };

        var isRegistered = _userService.Register(user);

        if (!isRegistered)
        {
            return BadRequest("Username already exists.");
        }

        return Ok("User registered successfully.");
    }

    // LOGIN
    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        // 👇 ARTIK TOKEN GELİYOR
        var token = _userService.Login(dto.Username, dto.Password);

        if (token == null)
        {
            return Unauthorized("Invalid username or password.");
        }

        return Ok(new LoginResponseDto
        {
            Token = token
        });
    }
}