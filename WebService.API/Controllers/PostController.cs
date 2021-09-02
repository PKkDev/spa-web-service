using WebService.Domain.Dto.Post;
using WebService.Domain.Model;
using WebService.Domain.ServicesContract;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Query.Post;
using Microsoft.AspNetCore.Authorization;

namespace WebService.API.Controllers
{
    /// <summary>
    /// контроллер обработки постов
    /// </summary>
    [ApiController]
    [Route("api/post")]
    public class PostController : Controller
    {
        private readonly IPostService _service;

        /// <summary>
        /// инициализация контроллера
        /// </summary>
        /// <param name="service"></param>
        public PostController(IPostService service)
        {
            _service = service;
        }

        /// <summary>
        /// получение всех постов
        /// </summary>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpGet("list")]
        public async Task<IEnumerable<PostDto>> GetListPost(CancellationToken ct = default)
        {
            return await _service.GetPosts(ct);
        }

        /// <summary>
        /// получение количества постов
        /// </summary>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpGet("count")]
        public async Task<int> GetCountPost(CancellationToken ct = default)
        {
            return await _service.GetCountPosts(ct);
        }

        /// <summary>
        /// получение поста по id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<PostDto> GetPost
            ([FromQuery] int id, CancellationToken ct = default)
        {
            return await _service.GetPost(id, ct);
        }

        /// <summary>
        /// добавление описания посту
        /// </summary>
        /// <param name="post"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("add-post")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> AddPost
            ([FromBody] PostDto post, CancellationToken ct = default)
        {
            var result = await _service.AddPost(post, ct);
            if (result != -1)
                return Ok(result);
            return BadRequest();
        }

        /// <summary>
        /// изменение поста
        /// </summary>
        /// <param name="id"></param>
        /// <param name="post"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("update-post")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> UpdatePost
            ([FromQuery] int id, [FromBody] PostDto post, CancellationToken ct = default)
        {
            var result = await _service.UpdatePost(id, post, ct);
            if (result != -1)
                return Ok(result);
            return BadRequest();
        }

        /// <summary>
        /// добавление файлов посту
        /// </summary>
        /// <param name="files"></param>
        /// <param name="id"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("update-file")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> UpdatePostFile
            (IFormCollection files, [FromQuery] int id, CancellationToken ct = default)
        {
            var mergedFiles = new List<LoadFileInfo>();

            foreach (var file in files.Files)
            {
                byte[] byteData = null;
                using (var binaryReader = new BinaryReader(file.OpenReadStream()))
                {
                    byteData = binaryReader.ReadBytes((int)file.Length);
                }
                mergedFiles.Add(new LoadFileInfo()
                {
                    Size = file.Length,
                    FileByte = byteData,
                    Name = file.FileName
                });
            }
            var result = await _service.UpdatePostFile(mergedFiles, id, ct);

            if (result)
                return Ok();
            return BadRequest();
        }

        /// <summary>
        /// удаление поста
        /// </summary>
        /// <param name="id"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpDelete("remove-post")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> RemovePost
            ([FromQuery] int id, CancellationToken ct = default)
        {
            var result = await _service.RemovePostAsync(id, ct);
            if (result)
                return Ok();
            return BadRequest();
        }

        /// <summary>
        /// удаление файла поста
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpDelete("remove-file")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> RemovePostFile
            ([FromQuery] int id, [FromQuery] string name, CancellationToken ct = default)
        {
            var result = await _service.RemovePostFileAsync(id, name, ct);
            if (result)
                return Ok();
            return BadRequest();
        }


        /// <summary>
        /// загрузка файла
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("file")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> DownloadFIle(
            [FromBody] LoadFileQuery query, CancellationToken ct = default)
        {
            var result = await _service.GetFileAsync(query.Id, query.Name, ct);
            return File(result, GetContentType(query.Name), query.Name);
        }

        private string GetContentType(string path)
        {
            var fileProvider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!fileProvider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }


    }
}

