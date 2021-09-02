using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.ToDo;
using WebService.Domain.Query.ToDo;
using WebService.Domain.ServicesContract;

namespace WebService.API.Controllers
{
    /// <summary>
    /// контроллер обрабатывающий запросы на получение информации по todo типу
    /// </summary>
    [Route("api/todo")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private IToDoService _service { get; set; }

        /// <summary>
        /// инициализация контроллера
        /// </summary>
        /// <param name="service"></param>
        public TodoController(IToDoService service)
        {
            _service = service;
        }

        /// <summary>
        /// получение кол-ва записей
        /// </summary>
        /// <param name="IdUser"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpGet("count")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<int> GetCountRecord
            ([FromQuery] int IdUser, CancellationToken ct = default)
        {
            return await _service.GetCountRecordAsync(IdUser, ct);
        }

        /// <summary>
        /// запрос на получение списка записей
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("list")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IEnumerable<ToDoRecordDto>> GetTodoRecords
            ([FromBody] GetToDoQuery query, CancellationToken ct = default)
        {
            return await _service.GetToDoRecordsAsync(query, ct);
        }

        /// <summary>
        /// удаление записи
        /// </summary>
        /// <param name="IdRecord"></param>
        /// <param name="IdUser"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpDelete]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> RemoveTodoRecord
            ([FromQuery] int IdRecord, [FromQuery] int IdUser, CancellationToken ct = default)
        {
            var result = await _service.RemoveTodoRecordAsync(IdRecord, IdUser, ct);
            if (result)
                return Ok();
            return BadRequest();
        }

        /// <summary>
        /// обновление записи
        /// </summary>
        /// <param name="record"></param>
        /// <param name="IdUser"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> UpdateTodoRecord
            ([FromBody] ToDoRecordDto record, [FromQuery] int IdUser, CancellationToken ct = default)
        {
            var result = await _service.UpdateTodoRecordAsync(record, IdUser, ct);
            if (result)
                return Ok();
            return BadRequest();
        }

        /// <summary>
        /// добавление записи
        /// </summary>
        /// <param name="record"></param>
        /// <param name="IdUser"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost()]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> AddTodoRecord
             ([FromBody] ToDoRecordDto record, [FromQuery] int IdUser, CancellationToken ct = default)
        {
            var result = await _service.AddTodoRecordAsync(record, IdUser, ct);
            if (result)
                return Ok();
            return BadRequest();
        }

        /// <summary>
        /// экспорт записей по фильтру
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("export-file")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> ExportRecord
            ([FromBody] GetToDoQuery query, CancellationToken ct = default)
        {
            var arrByte = await _service.GetExportFileAsync(query, ct);
            return File(arrByte, GetContentType("file.xlsx"));
        }

        /// <summary>
        /// импорт записей
        /// </summary>
        /// <param name="file"></param>
        /// <param name="IdUser"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("import-file")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> ImportRecord
            (IFormFile file, [FromQuery] int IdUser, CancellationToken ct = default)
        {
            using var stream = file.OpenReadStream();
            var result = await _service.ImportFIleAsync(stream, IdUser, ct);
            if (result)
                return Ok();
            return BadRequest();
        }

        /// <summary>
        /// определение типа контента
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
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
