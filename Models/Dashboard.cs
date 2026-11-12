namespace CbsaBiReporting.Models
{
    public class Dashboard
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<DashboardTab> Tabs { get; set; } = new();
    }

    public class DashboardTab
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string SqlQuery { get; set; } = string.Empty;
        public List<KpiDefinition> Kpis { get; set; } = new();
        public List<ChartConfig> Charts { get; set; } = new();
        public TableConfig? Table { get; set; }
    }

    public class KpiDefinition
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Change { get; set; } = string.Empty;
        public bool IsPositive { get; set; } = true;
        public string Icon { get; set; } = string.Empty;
        public string? SqlColumn { get; set; }
    }

    public class ChartConfig
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = "bar"; // bar, line, area
        public string XKey { get; set; } = "name";
        public List<ChartSeries> Series { get; set; } = new();
        public List<Dictionary<string, object>> Data { get; set; } = new();
    }

    public class ChartSeries
    {
        public string Key { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = "#002B49";
    }

    public class TableConfig
    {
        public string Title { get; set; } = string.Empty;
        public List<string> Columns { get; set; } = new();
        public List<Dictionary<string, object>> Rows { get; set; } = new();
    }
}
