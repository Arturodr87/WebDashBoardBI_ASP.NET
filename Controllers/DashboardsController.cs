using CbsaBiReporting.Models;
using CbsaBiReporting.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CbsaBiReporting.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardsController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardsController> _logger;

        public DashboardsController(IDashboardService dashboardService, ILogger<DashboardsController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene el listado de todos los dashboards disponibles segun el rol del usuario
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _dashboardService.GetAllDashboardsAsync();
            return Ok(list);
        }

        /// <summary>
        /// Obtiene el detalle de un dashboard por su identificador unico
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var dash = await _dashboardService.GetDashboardByIdAsync(id);
            if (dash == null)
            {
                return NotFound(new { error = $"Dashboard '{id}' no encontrado." });
            }
            return Ok(dash);
        }

        /// <summary>
        /// Crea un nuevo dashboard con sus vistas y KPIs (Solo administradores)
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Create([FromBody] Dashboard dashboard)
        {
            if (string.IsNullOrWhiteSpace(dashboard.Title))
            {
                return BadRequest(new { error = "El titulo del dashboard es obligatorio." });
            }

            var created = await _dashboardService.CreateDashboardAsync(dashboard);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        /// <summary>
        /// Actualiza un dashboard existente (Solo administradores)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Update(string id, [FromBody] Dashboard dashboard)
        {
            var updated = await _dashboardService.UpdateDashboardAsync(id, dashboard);
            if (updated == null)
            {
                return NotFound(new { error = $"Dashboard '{id}' no encontrado para actualizar." });
            }
            return Ok(updated);
        }

        /// <summary>
        /// Elimina un dashboard (Solo administradores)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _dashboardService.DeleteDashboardAsync(id);
            if (!success)
            {
                return NotFound(new { error = $"Dashboard '{id}' no encontrado para eliminar." });
            }
            return Ok(new { success = true, message = $"Dashboard '{id}' eliminado correctamente." });
        }
    }
}
