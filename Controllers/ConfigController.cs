using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CbsaBiReporting.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ConfigController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("connection")]
        public IActionResult GetConnectionInfo()
        {
            var connStr = _config.GetConnectionString("SqlServerConnection") ?? "";
            var ldapUrl = _config["LdapSettings:Url"] ?? "";
            var domain = _config["LdapSettings:Domain"] ?? "";

            return Ok(new
            {
                Architecture = "ASP.NET Core 8 Web API + React SPA",
                TargetRuntime = "net8.0",
                Ide = "Visual Studio 2022 / VS Code",
                Database = new
                {
                    Engine = "Microsoft SQL Server 2019/2022",
                    Client = "Microsoft.Data.SqlClient (Managed Connection Pool)",
                    Configured = !string.IsNullOrEmpty(connStr)
                },
                Authentication = new
                {
                    Type = "Active Directory LDAP",
                    Server = "Windows Server 2012 R2",
                    LdapUrl = ldapUrl,
                    Domain = domain
                }
            });
        }
    }
}
