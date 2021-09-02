using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebService.Domain.Dto.Error;

namespace WebService.API.Controllers
{
    /// <summary>
    /// accept service error on prod
    /// </summary>
    [AllowAnonymous]
    [ApiExplorerSettings(IgnoreApi = true)]
    [ApiController]
    public class ErrorController : ControllerBase
    {

        /// <summary>
        /// generate error response from service
        /// </summary>
        /// <returns></returns>
        [Route("error")]
        public HttpResponseException AcceptAPIError()
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = context.Error;

            var code = 500;
            Response.StatusCode = code;

            return new HttpResponseException(exception.Message);
        }
    }
}
