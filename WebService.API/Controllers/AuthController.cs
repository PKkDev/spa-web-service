using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Query.Auth;
using WebService.Domain.ServicesContract;

namespace WebService.API.Controllers
{
    /// <summary>
    /// auth controller
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        /// <summary>
        /// initialization
        /// </summary>
        /// <param name="service"></param>
        public AuthController(IAuthService service)
        {
            _service = service;
        }

        #region login/pass

        #endregion

        /// <summary>
        /// authentication user on login/pass
        /// </summary>
        /// <param name="ct"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AuthUser
            ([FromBody] AuthorizeQuery query, CancellationToken ct = default)
        {
            var token = await _service.Authorize(query.UserName, query.Password, ct);
            return Ok(token);
        }

        #region sms

        /// <summary>
        /// send sms with code to user
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("send-sms")]
        public async Task<IActionResult> SendAccesTokenToSms(
            [FromBody] PhoneAuthorizeQuery query, CancellationToken ct = default)
        {
            await _service.SendAccesTokenToSmsAsync(query.Phone, ct);
            return Ok();
        }

        /// <summary>
        /// check code from sms and user
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("check-sms")]
        public async Task<IActionResult> CheckPhoneAccessToken(
            [FromBody] CheckPhoneAuthorizeQuery query, CancellationToken ct = default)
        {
            var token = await _service.CheckPhoneAccessTokenAsync(query.Phone, query.Code, ct);
            return Ok(token);
        }

        #endregion


    }
}
