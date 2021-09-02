using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace WebService.Infrastructure.Token
{
    public class AuthOptions
    {
        public const string ISSUER = "AuthServer";
        public const string AUDIENCE = "clientTestForTest";
        const string KEY = "!key_super_secret_secret_key!123";
        public const int LIFETIME = 1 * 60 * 24;

        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
