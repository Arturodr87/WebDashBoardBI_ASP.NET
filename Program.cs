using System.Text;
using CbsaBiReporting.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. Configuracion de Servicios e Inyeccion de Dependencias
// ==========================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Documentacion Swagger / OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CBSA BI Reporting API - ASP.NET Core 8",
        Version = "v1",
        Description = "API de Inteligencia de Negocios y Dashboards conectada a SQL Server y LDAP Active Directory (Windows Server 2012)."
    });
    
    // Configuracion de autenticacion JWT Bearer en Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Ingrese el token JWT en el formato: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ==========================================
// 2. Registro de Servicios del Dominio (Singleton / Scoped)
// ==========================================
// Conexion a SQL Server mediante Microsoft.Data.SqlClient con Connection Pool
builder.Services.AddSingleton<ISqlServerService, SqlServerService>();

// Autenticacion LDAP contra Active Directory (Windows Server 2012)
builder.Services.AddScoped<ILdapAuthService, LdapAuthService>();

// Servicio de Dashboards CBSA y Vistas
builder.Services.AddSingleton<IDashboardService, DashboardService>();

// ==========================================
// 3. Autenticacion y Autorizacion (JWT)
// ==========================================
var jwtKey = builder.Configuration["Jwt:Key"] ?? "CBSA_Secret_Key_For_Jwt_Token_Production_2026_Minimum_256_Bits!";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("Admin", "User"));
});

// ==========================================
// 4. Politica CORS para el Frontend React
// ==========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ==========================================
// 5. Middleware Pipeline
// ==========================================
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CBSA BI Reporting API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("CorsPolicy");
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Soporte de archivos estaticos para el bundle de React Vite (dist)
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Fallback para React Router / SPA
app.MapFallbackToFile("index.html");

app.Run();
