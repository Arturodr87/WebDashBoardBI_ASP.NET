using CbsaBiReporting.Models;

namespace CbsaBiReporting.Services
{
    public interface ISqlServerService
    {
        Task<SqlQueryResult> ExecuteQueryAsync(string sql, Dictionary<string, object>? parameters = null);
        Task<DbStatus> GetStatusAsync();
        bool ValidateQuerySafety(string sql);
    }
}
