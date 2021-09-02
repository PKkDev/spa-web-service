using System.Threading;
using System.Threading.Tasks;

namespace WebService.Domain.ServicesContract
{
    public interface IJwtTokenService
    {
        public Task<string> CreateTokenAsync(string login, CancellationToken ct);

        public Task<int> GetIdUserAsync(string login, CancellationToken ct);
    }
}
