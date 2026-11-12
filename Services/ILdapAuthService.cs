using CbsaBiReporting.Models;

namespace CbsaBiReporting.Services
{
    public interface ILdapAuthService
    {
        Task<LoginResponse> AuthenticateAsync(string username, string password);
        UserProfile? ValidateToken(string token);
    }
}
