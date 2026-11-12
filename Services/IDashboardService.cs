using CbsaBiReporting.Models;

namespace CbsaBiReporting.Services
{
    public interface IDashboardService
    {
        Task<List<Dashboard>> GetAllDashboardsAsync();
        Task<Dashboard?> GetDashboardByIdAsync(string id);
        Task<Dashboard> CreateDashboardAsync(Dashboard dashboard);
        Task<Dashboard?> UpdateDashboardAsync(string id, Dashboard dashboard);
        Task<bool> DeleteDashboardAsync(string id);
    }
}
