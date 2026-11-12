namespace CbsaBiReporting.Models
{
    public class UserProfile
    {
        public string Username { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // "Admin" | "User"
        public string Department { get; set; } = string.Empty;
        public string Domain { get; set; } = "cbsa.local";
        public string AvatarUrl { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public UserProfile? User { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
