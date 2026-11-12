using CbsaBiReporting.Models;
using CbsaBiReporting.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CbsaBiReporting.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QueryController : ControllerBase
    {
        private readonly ISqlServerService _sqlServerService;

        public QueryController(ISqlServerService sqlServerService)
        {
            _sqlServerService = sqlServerService;
        }

        /// <summary>
        /// Ejecuta una consulta SQL parametrizada contra la base de datos SQL Server
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> ExecuteQuery([FromBody] SqlQueryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return BadRequest(new { error = "La consulta SQL no puede estar vacia." });
            }

            var result = await _sqlServerService.ExecuteQueryAsync(request.Query, request.Parameters);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Retorna el estado del pool de conexiones SQL Server
        /// </summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            var status = await _sqlServerService.GetStatusAsync();
            return Ok(status);
        }
    }
}
