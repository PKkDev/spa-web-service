using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.Auth;

namespace WebService.Domain.ServicesContract
{
    public interface IAuthService
    {
        /// <summary>
        /// authentication user on login/pass
        /// </summary>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<LoginResponseDto> Authorize(string login, string password, CancellationToken ct);

        /// <summary>
        /// send sms with code to user
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<bool> SendAccesTokenToSmsAsync(string phone, CancellationToken ct);

        /// <summary>
        /// check code from sms and user
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="code"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<LoginResponseDto> CheckPhoneAccessTokenAsync(string phone, string code, CancellationToken ct);
    }
}
