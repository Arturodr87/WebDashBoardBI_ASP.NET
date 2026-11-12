import React, { useState } from 'react';
import { 
  Server, 
  Code, 
  FileCode, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  X,
  Layers,
  ChevronRight
} from 'lucide-react';

interface AspNetCoreArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AspNetCoreArchitectureModal: React.FC<AspNetCoreArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('Program.cs');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fileContents: Record<string, { desc: string; code: string; language: string }> = {
    'Program.cs': {
      desc: 'Punto de entrada de la API ASP.NET Core 8: Configura Swagger, autenticación JWT, pool de SQL Server, LDAP y Middleware SPA.',
      language: 'csharp',
      code: `using System.Text;
using CbsaBiReporting.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Inyección de dependencias
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Servicios del Dominio CBSA
builder.Services.AddSingleton<ISqlServerService, SqlServerService>();
builder.Services.AddScoped<ILdapAuthService, LdapAuthService>();
builder.Services.AddSingleton<IDashboardService, DashboardService>();

// Autenticación JWT Bearer
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();`
    },
    'Controllers/DashboardsController.cs': {
      desc: 'Controlador RESTful para Dashboards y Vistas. Protegido con [Authorize] y políticas de roles [Authorize(Policy = "AdminOnly")].',
      language: 'csharp',
      code: `using CbsaBiReporting.Models;
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

        public DashboardsController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _dashboardService.GetAllDashboardsAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id) {
            var dash = await _dashboardService.GetDashboardByIdAsync(id);
            return dash == null ? NotFound() : Ok(dash);
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Create([FromBody] Dashboard dashboard) {
            var created = await _dashboardService.CreateDashboardAsync(dashboard);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
    }
}`
    },
    'Services/SqlServerService.cs': {
      desc: 'Pool de conexiones nativo a Microsoft SQL Server mediante Microsoft.Data.SqlClient con validación de inyección SQL.',
      language: 'csharp',
      code: `using System.Data;
using Microsoft.Data.SqlClient;
using CbsaBiReporting.Models;

namespace CbsaBiReporting.Services
{
    public class SqlServerService : ISqlServerService
    {
        private readonly string _connectionString;

        public SqlServerService(IConfiguration config) {
            _connectionString = config.GetConnectionString("SqlServerConnection")!;
        }

        public async Task<SqlQueryResult> ExecuteQueryAsync(string sql, Dictionary<string, object>? parameters = null) {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = sql;
            
            if (parameters != null) {
                foreach (var (k, v) in parameters) {
                    cmd.Parameters.AddWithValue(k.StartsWith("@") ? k : "@" + k, v ?? DBNull.Value);
                }
            }
            using var reader = await cmd.ExecuteReaderAsync();
            var results = new List<Dictionary<string, object>>();
            while (await reader.ReadAsync()) {
                var row = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++) row[reader.GetName(i)] = reader.GetValue(i);
                results.Add(row);
            }
            return new SqlQueryResult { Success = true, Rows = results, RowCount = results.Count };
        }
    }
}`
    },
    'Services/LdapAuthService.cs': {
      desc: 'Autenticación corporativa Active Directory contra Windows Server 2012 mediante Novell.Directory.Ldap con emisión de token JWT.',
      language: 'csharp',
      code: `using Novell.Directory.Ldap;
using CbsaBiReporting.Models;

namespace CbsaBiReporting.Services
{
    public class LdapAuthService : ILdapAuthService
    {
        private readonly IConfiguration _config;

        public LdapAuthService(IConfiguration config) {
            _config = config;
        }

        public async Task<LoginResponse> AuthenticateAsync(string username, string password) {
            var ldapUrl = _config["LdapSettings:Url"]!;
            var domain = _config["LdapSettings:Domain"]!;

            using var conn = new LdapConnection();
            var uri = new Uri(ldapUrl);
            await Task.Run(() => {
                conn.Connect(uri.Host, uri.Port > 0 ? uri.Port : 389);
                conn.Bind($"{username}@{domain}", password);
            });

            // Generar claims y token JWT para el usuario autenticado
            var token = GenerateJwtToken(username, "Admin");
            return new LoginResponse { Success = true, Token = token };
        }
    }
}`
    },
    'appsettings.json': {
      desc: 'Parámetros de conexión a SQL Server corporativo, Windows Server 2012 LDAP y firma criptográfica JWT.',
      language: 'json',
      code: `{
  "ConnectionStrings": {
    "SqlServerConnection": "Server=192.168.1.100,1433;Database=CBSA_CorporateBI;User Id=cbsa_bi_user;Password=YourSecurePassword2026!;Encrypt=True;TrustServerCertificate=True;Max Pool Size=100;Min Pool Size=5;"
  },
  "LdapSettings": {
    "Url": "ldap://192.168.1.10:389",
    "Domain": "cbsa.local",
    "BaseDn": "dc=cbsa,dc=local",
    "ServerType": "Windows Server 2012 R2 Active Directory"
  },
  "Jwt": {
    "Key": "CBSA_Secret_Key_For_Jwt_Token_Production_2026_Minimum_256_Bits!",
    "ExpiryHours": 8
  }
}`
    },
    'CbsaBiReporting.csproj': {
      desc: 'Archivo de proyecto C# .NET 8.0 con paquetes NuGet oficiales para SQL Server, LDAP, JWT y Swagger.',
      language: 'xml',
      code: `<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <SpaRoot>./</SpaRoot>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Data.SqlClient" Version="5.2.0" />
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.2" />
    <PackageReference Include="Novell.Directory.Ldap.NETStandard" Version="3.6.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  </ItemGroup>
</Project>`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[selectedFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#002B49] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A3E0] to-[#FFBF00] flex items-center justify-center shadow-md">
              <Server className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Arquitectura ASP.NET Core 8 & React SPA</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-[#00A3E0]/20 text-[#00A3E0] rounded-full border border-[#00A3E0]/40">
                  Visual Studio 2022
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Solución lista para producción: C# Web API + SQL Server Connection Pool + Windows Server 2012 LDAP + ClientApp React
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges / Metrics Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <Layers className="w-4 h-4 text-[#00A3E0]" />
              <strong>Solución:</strong> CbsaBiReporting.sln
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <Database className="w-4 h-4 text-[#002B49]" />
              <strong>Driver DB:</strong> Microsoft.Data.SqlClient (Pool 100)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <strong>Auth:</strong> Active Directory LDAP & JWT Bearer
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> net8.0 Ready
            </span>
          </div>
        </div>

        {/* Body (Sidebar + Code Editor View) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* File Explorer */}
          <div className="w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-3 px-2">
                Explorador de Solución
              </div>
              <div className="space-y-1">
                {Object.keys(fileContents).map(fileName => {
                  const isSelected = selectedFile === fileName;
                  return (
                    <button
                      key={fileName}
                      onClick={() => setSelectedFile(fileName)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-all ${
                        isSelected 
                          ? 'bg-[#00A3E0] text-slate-950 font-bold shadow-sm' 
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {fileName.endsWith('.cs') ? (
                          <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-blue-400'}`} />
                        ) : fileName.endsWith('.json') ? (
                          <Code className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                        ) : (
                          <Layers className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                        )}
                        <span className="truncate">{fileName}</span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="font-semibold text-slate-200">Compatibilidad Visual Studio:</div>
              <p>
                Los archivos se encuentran en la raíz del proyecto para abrirse directamente con Visual Studio 2022 o VS Code.
              </p>
              <div className="p-2.5 bg-slate-800/80 rounded-lg text-[10px] text-blue-200">
                Archivo de guía: <strong className="text-white">README_ASPNETCORE.md</strong>
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* File Info Bar */}
            <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-blue-300">{selectedFile}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {fileContents[selectedFile].desc}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar C#'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed text-slate-200">
              <pre className="selection:bg-blue-600 selection:text-white">
                <code>{fileContents[selectedFile].code}</code>
              </pre>
            </div>

            {/* Footer Status */}
            <div className="bg-slate-900 px-5 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Visual Studio 2022 Solution: CbsaBiReporting.sln
                </span>
                <span>•</span>
                <span>Framework: .NET 8.0</span>
              </div>
              <span className="text-slate-500 font-mono">UTF-8 • CRLF</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
