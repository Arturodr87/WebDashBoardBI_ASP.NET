namespace CbsaBiReporting.Models
{
    public class SqlQueryRequest
    {
        public string Query { get; set; } = string.Empty;
        public Dictionary<string, object>? Parameters { get; set; }
    }

    public class SqlQueryResult
    {
        public bool Success { get; set; }
        public List<Dictionary<string, object>> Rows { get; set; } = new();
        public int RowCount { get; set; }
        public double ExecutionTimeMs { get; set; }
        public string? Error { get; set; }
        public string Source { get; set; } = "SQL Server 2019/2022";
    }

    public class DbStatus
    {
        public bool Connected { get; set; }
        public string Server { get; set; } = string.Empty;
        public string Database { get; set; } = string.Empty;
        public int ActivePoolCount { get; set; }
        public string Version { get; set; } = string.Empty;
    }
}
