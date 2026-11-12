# CBSA BI Reporting - Arquitectura ASP.NET Core 8 & React SPA

Este proyecto ha sido estructurado siguiendo la arquitectura oficial de **ASP.NET Core 8 Web API** con **React SPA (ClientApp)** para **Visual Studio 2022**, listo para compilarse y desplegarse en **Windows Server 2012 / IIS**.

---

## 📁 Estructura de la Solución (Visual Studio 2022)

```
CbsaBiReporting/
│
├── CbsaBiReporting.sln            # Archivo de Solución de Visual Studio 2022
├── CbsaBiReporting.csproj         # Proyecto C# (.NET 8.0) con dependencias NuGet
├── Program.cs                     # Configuración de Middleware, DI, JWT y SPA
├── appsettings.json               # Configuración de SQL Server, LDAP y JWT
├── appsettings.Development.json   # Configuración para entorno local
│
├── Controllers/                   # Controladores ASP.NET Core Web API
│   ├── DashboardsController.cs    # CRUD de Dashboards y Vistas (/api/dashboards)
│   ├── AuthController.cs          # Login LDAP Windows Server 2012 (/api/auth)
│   ├── QueryController.cs         # Consultas SQL Server parametrizadas (/api/query)
│   └── ConfigController.cs        # Verificación de infraestructura (/api/config)
│
├── Services/                      # Lógica de Negocio e Integraciones
│   ├── ISqlServerService.cs       # Interfaz del Pool de Conexiones SQL Server
│   ├── SqlServerService.cs        # Implementación con Microsoft.Data.SqlClient
│   ├── ILdapAuthService.cs        # Interfaz de Autenticación Active Directory
│   ├── LdapAuthService.cs         # Implementación con Novell.Directory.Ldap
│   ├── IDashboardService.cs       # Interfaz de gestión de Dashboards CBSA
│   └── DashboardService.cs        # Servicio en memoria y persistencia
│
├── Models/                        # Modelos de Datos Fuertemente Tipados
│   ├── Dashboard.cs               # Clases: Dashboard, DashboardTab, Kpi, ChartConfig
│   ├── UserProfile.cs             # Clases: UserProfile, LoginRequest, LoginResponse
│   └── SqlModels.cs               # Clases: SqlQueryRequest, SqlQueryResult, DbStatus
│
├── Properties/
│   └── launchSettings.json        # Perfiles de ejecución IIS Express y Kestrel
│
└── src/ (ClientApp)               # Frontend React 19 + TailwindCSS + Recharts
    ├── components/                # Sidebar, Header, KPI Cards, Charts, Tables
    ├── services/                  # Cliente HTTP Axios / Fetch con reintento y JWT
    └── ...
```

---

## 🚀 Cómo abrir y ejecutar en Visual Studio 2022

1. **Abrir la Solución**:
   - Haz doble clic en `CbsaBiReporting.sln` o abre Visual Studio 2022 y selecciona **Archivo > Abrir > Proyecto o Solución**.

2. **Restaurar Paquetes NuGet**:
   - Visual Studio restaurará automáticamente:
     - `Microsoft.Data.SqlClient` (v5.2.0)
     - `Microsoft.AspNetCore.Authentication.JwtBearer` (v8.0.2)
     - `Novell.Directory.Ldap.NETStandard` (v3.6.0)
     - `Swashbuckle.AspNetCore` (v6.5.0)

3. **Configurar la Cadena de Conexión a SQL Server**:
   - Abre `appsettings.json` y edita la sección `ConnectionStrings:SqlServerConnection`:
     ```json
     "SqlServerConnection": "Server=TU_SERVIDOR_SQL,1433;Database=CBSA_CorporateBI;User Id=tu_usuario;Password=tu_password;Encrypt=True;TrustServerCertificate=True;"
     ```

4. **Configurar el Servidor LDAP (Windows Server 2012)**:
   - Configura la IP de tu controlador de dominio Active Directory en `LdapSettings:Url` (`ldap://192.168.1.10:389`) y el dominio `cbsa.local`.

5. **Ejecutar la Aplicación (`F5` o `Ctrl + F5`)**:
   - Selecciona el perfil **http** o **IIS Express**.
   - Se abrirá la documentación interactiva de Swagger en `http://localhost:5000/swagger`.
   - La aplicación React SPA se compilará y servirá en la raíz `/`.

---

## 🌐 Despliegue en IIS (Windows Server 2012 R2)

1. En Visual Studio, haz clic derecho en el proyecto `CbsaBiReporting` > **Publicar**.
2. Selecciona destino **Carpeta** (ej. `bin\Release\net8.0\publish`).
3. Instala en Windows Server 2012 el **ASP.NET Core Hosting Bundle (.NET 8)**.
4. En IIS Manager:
   - Crea un nuevo Sitio Web o Aplicación apuntando a la carpeta de publicación.
   - En el Application Pool, selecciona **No Managed Code**.
   - Habilita las conexiones entrantes en el firewall para el puerto configurado.
