using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.ServicesContract;
using WebService.Infrastructure.Context;
using WebService.Infrastructure.Entity;
using WebService.Infrastructure.Token;

namespace WebService.Infrastructure.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly ApplicationContext _context;

        public JwtTokenService(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<string> CreateTokenAsync(string login, CancellationToken ct)
        {
            User user = await _context.User
                .FirstOrDefaultAsync(x => x.UserName == login, ct);

            var identity = GetIdentity(login);

            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                notBefore: now,
                claims: identity.Claims,
                expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(),
                    SecurityAlgorithms.HmacSha256));

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            return encodedJwt;
        }

        public async Task<int> GetIdUserAsync(string login, CancellationToken ct)
        {
            User user = await _context.User
               .FirstOrDefaultAsync(x => x.UserName == login, ct);

            return user.Id;
        }

        private ClaimsIdentity GetIdentity(string login)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimsIdentity.DefaultNameClaimType, login));

            ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);

            return claimsIdentity;
        }

    }

}