using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.Auth;
using WebService.Domain.ServicesContract;
using WebService.Infrastructure.Context;
using WebService.Infrastructure.Entity;

namespace WebService.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ApplicationContext _context;
        private readonly IHttpClientFactory _clientFactory;

        public AuthService(
            IJwtTokenService jwtTokenService, ApplicationContext context,
            IHttpClientFactory clientFactory)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _clientFactory = clientFactory;
        }

        /// <summary>
        /// authentication user on login/pass
        /// </summary>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        public async Task<LoginResponseDto> Authorize(
            string login, string password, CancellationToken ct)
        {
            User user = await _context.User
                 .FirstOrDefaultAsync(x => x.UserName == login, ct);

            if (user == null)
                throw new Exception("логин не существует");

            if (user.Password != password)
                throw new Exception("пароль неверный");

            string token = await _jwtTokenService.CreateTokenAsync(login, ct);
            int id = await _jwtTokenService.GetIdUserAsync(login, ct);

            var result = new LoginResponseDto(id, token);

            return result;
        }

        #region sms checks

        /// <summary>
        /// send sms with code to user
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        public async Task<bool> SendAccesTokenToSmsAsync(string phone, CancellationToken ct)
        {
            var user = await _context.User
               .FirstOrDefaultAsync(x => x.PhoneNumber.Equals(phone), ct);

            if (user == null)
                throw new Exception("пользователей не найден");

            var code = GeneratePhoneNumberTokenAsync();

            user.PhoneCode = code;

            _context.User.Update(user);
            await _context.SaveChangesAsync(ct);

            var client = _clientFactory.CreateClient("smsAreaApi");
            var message = $"код для доступа: {code}";
            var queryParam = new Dictionary<string, string>()
            {
                {"number", $"{phone}"},
                {"text", $"{message}"},
                {"sign", "SMS Aero"}
            };
            var uri = QueryHelpers.AddQueryString(client.BaseAddress.AbsoluteUri, queryParam);
            var request = new HttpRequestMessage(HttpMethod.Get, uri);

            //var encodedPass = Encoding.ASCII.GetBytes($"{userName}:{password}");
            //var authClime = Convert.ToBase64String(encodedPass);
            //request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authClime);

            var response = await client.SendAsync(request, ct);
            var responseMessage = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)

                return true;

            throw new Exception("ошибка при отправке sms");
        }

        /// <summary>
        /// generate 4-digit code
        /// </summary>
        /// <returns></returns>
        private string GeneratePhoneNumberTokenAsync()
        {
            var rnd = new Random();
            var start = rnd.Next(9, 99);
            var end = DateTime.Now.Second;
            return start.ToString() + end.ToString();
        }

        /// <summary>
        /// check code from sms and user
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="code"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        public async Task<LoginResponseDto> CheckPhoneAccessTokenAsync(
            string phone, string code, CancellationToken ct)
        {
            var user = await _context.User
               .FirstOrDefaultAsync(x => x.PhoneNumber.Equals(phone), ct);

            if (user == null)
                throw new Exception("пользователей не найден");

            if (code == user.PhoneCode)
                return await Authorize(user.UserName, user.Password, ct);
            else
                return null;
        }

        #endregion

    }
}
