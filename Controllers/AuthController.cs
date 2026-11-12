using CbsaBiReporting.Models;
using CbsaBiReporting.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CbsaBiReporting.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILdapAuthService _ldapAuthService;

        public AuthController(ILdapAuthService ldapAuthService)
        {
            _ldapAuthService = ldapAuthService;
        }

        /// <summary>
        /// Login de usuario mediante LDAP contra Windows Server 2012 Active Directory
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _ldapAuthService.AuthenticateAsync(request.Username, request.Password);
            if (!result.Success)
            {
                return Unauthorized(result);
            }
            return Ok(result);
        }

        /// <summary>
        /// Obtiene el perfil del usuario autenticado actual desde el token Bearer
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetMe()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { error = "Token Bearer no proporcionado." });
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            var user = _ldapAuthService.ValidateToken(token);
            if (user == null)
            {
                return Unauthorized(new { error = "Token invalido o expirado." });
            }

            return Ok(user);
        }
    }
}
