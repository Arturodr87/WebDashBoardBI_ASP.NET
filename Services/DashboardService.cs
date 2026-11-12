using CbsaBiReporting.Models;

namespace CbsaBiReporting.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly List<Dashboard> _dashboards = new();

        public DashboardService()
        {
            SeedInitialDashboards();
        }

        public Task<List<Dashboard>> GetAllDashboardsAsync()
        {
            return Task.FromResult(_dashboards.ToList());
        }

        public Task<Dashboard?> GetDashboardByIdAsync(string id)
        {
            var dash = _dashboards.FirstOrDefault(d => d.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(dash);
        }

        public Task<Dashboard> CreateDashboardAsync(Dashboard dashboard)
        {
            if (string.IsNullOrEmpty(dashboard.Id))
            {
                dashboard.Id = "dash-" + Guid.NewGuid().ToString("N")[..8];
            }
            dashboard.CreatedAt = DateTime.UtcNow;
            dashboard.UpdatedAt = DateTime.UtcNow;
            _dashboards.Add(dashboard);
            return Task.FromResult(dashboard);
        }

        public Task<Dashboard?> UpdateDashboardAsync(string id, Dashboard dashboard)
        {
            var idx = _dashboards.FindIndex(d => d.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (idx == -1) return Task.FromResult<Dashboard?>(null);

            dashboard.Id = id;
            dashboard.UpdatedAt = DateTime.UtcNow;
            _dashboards[idx] = dashboard;
            return Task.FromResult<Dashboard?>(dashboard);
        }

        public Task<bool> DeleteDashboardAsync(string id)
        {
            var removed = _dashboards.RemoveAll(d => d.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(removed > 0);
        }

        private void SeedInitialDashboards()
        {
            // Dashboard Oficial CBSA (Cervecera Boliviana / Bebidas)
            var cbsaDash = new Dashboard
            {
                Id = "cbsa-industrial-bi",
                Title = "CBSA - Produccion y Distribucion Cervecera",
                Description = "Analisis de volumen (Hls), empaques retornables vs latas, ordenes historicas y metas comerciales 2026.",
                Category = "Operaciones y Ventas",
                CreatedBy = "Carlos Mendoza (Admin)",
                CreatedAt = DateTime.UtcNow.AddMonths(-3),
                UpdatedAt = DateTime.UtcNow,
                Tabs = new List<DashboardTab>
                {
                    new()
                    {
                        Id = "cbsa-empaque",
                        Title = "Empaque y Volumen (Hls)",
                        Icon = "package",
                        SqlQuery = "SELECT TipoEmpaque, SUM(VolumenHls) as VolumenHls, SUM(VentaBs) as TotalBs FROM Fact_Produccion GROUP BY TipoEmpaque;",
                        Kpis = new List<KpiDefinition>
                        {
                            new() { Id = "kpi-vol", Title = "Volumen Total (Hls)", Value = "237,350 Hls", Change = "+12.4% vs meta", IsPositive = true, Icon = "trending-up" },
                            new() { Id = "kpi-ret", Title = "Indice Retornabilidad", Value = "60.1%", Change = "+4.2% recuperacion", IsPositive = true, Icon = "repeat" },
                            new() { Id = "kpi-fact", Title = "NTO Facturado (Bs)", Value = "Bs 84,210,500", Change = "+15.8% interanual", IsPositive = true, Icon = "dollar-sign" },
                            new() { Id = "kpi-merm", Title = "Merma de Envasado", Value = "0.82%", Change = "-0.18% optimizacion", IsPositive = true, Icon = "check-circle" }
                        }
                    },
                    new()
                    {
                        Id = "cbsa-marcas",
                        Title = "Marcas y Clasificacion",
                        Icon = "award",
                        SqlQuery = "SELECT Marca, Categoria, SUM(VolumenHls) as Hls FROM Dim_Marca INNER JOIN Fact_Produccion ON Dim_Marca.Id = Fact_Produccion.MarcaId GROUP BY Marca, Categoria;"
                    },
                    new()
                    {
                        Id = "cbsa-ordenes",
                        Title = "Historico de Ordenes (2022-2026)",
                        Icon = "calendar",
                        SqlQuery = "SELECT Anio, Mes, COUNT(OrdenId) as TotalOrdenes, SUM(Monto) as MontoTotal FROM Fact_Ventas GROUP BY Anio, Mes ORDER BY Anio, Mes;"
                    },
                    new()
                    {
                        Id = "cbsa-metas",
                        Title = "Metas por Categoria (2026)",
                        Icon = "target",
                        SqlQuery = "SELECT Categoria, MetaHls, RealHls, (RealHls * 100.0 / MetaHls) as Cumplimiento FROM Dim_Metas2026;"
                    }
                }
            };

            _dashboards.Add(cbsaDash);
        }
    }
}
