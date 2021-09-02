using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.Department;
using WebService.Domain.Model;
using WebService.Domain.Query.Department;
using WebService.Domain.ServicesContract;

namespace WebService.API.Controllers
{
    /// <summary>
    /// обработки запросов получение информации по сотрудникам
    /// </summary>
    [Route("api/worker")]
    [ApiController]
    public class WorkerController : ControllerBase
    {
        private IDepartmentService _service;

        /// <summary>
        /// инициализация
        /// </summary>
        public WorkerController(IDepartmentService service)
        {
            _service = service;
        }

        /// <summary>
        /// получение списка сотрудников департамента
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IEnumerable<WorkerDto>> GetDepartmentWorkers(
          [FromQuery] int departmentId, CancellationToken ct = default)
        {
            return await _service.GetDepartmentWorkersAsync(departmentId, ct);
        }

        /// <summary>
        /// удаление сотрудника
        /// </summary>
        /// <param name="workerId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<bool> RemoveWorker(
            [FromQuery] int workerId, CancellationToken ct = default)
        {
            return await _service.RemoveWorkerAsync(workerId, ct);
        }

        /// <summary>
        /// изменение сотрудника
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<bool> UpdateWorker(
         [FromBody] WorkerDto query, CancellationToken ct = default)
        {
            return await _service.UpdateWorkerAsync(query, ct);
        }

        /// <summary>
        /// добавление сотрудника
        /// </summary>
        /// <param name="query"></param>
        /// <param name="departmentId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<bool> AddWorker(
          [FromBody] WorkerDto query, [FromQuery] int departmentId, CancellationToken ct = default)
        {
            return await _service.AddWorkerAsync(departmentId, query, ct);
        }

        /// <summary>
        /// экспорт записей по фильтру
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("export-file")]
        public async Task<IActionResult> ExportRecord
            ([FromBody] WorkerExportFIleQuery query, CancellationToken ct = default)
        {
            var arrByte = await _service.ExportWorkerFileAsync(query.DepartmentId, query.TypeFile, ct);
            return File(arrByte, GetContentType($"workers.{GetFileEx(query.TypeFile)}"));
        }

        /// <summary>
        /// импорт записей
        /// </summary>
        /// <param name="file"></param>
        /// <param name="DepartmentId"></param>
        /// <param name="TypeFile"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost("import-file")]
        public async Task<IActionResult> ImportRecord
            (IFormFile file, [FromQuery] int DepartmentId, [FromQuery] TypeFile TypeFile, CancellationToken ct = default)
        {
            using var stream = file.OpenReadStream();
            var result = await _service.ImportWorkerFileAsync(stream, DepartmentId, TypeFile, ct);
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

        /// <summary>
        /// определение расширения файла
        /// </summary>
        /// <param name="TypeFile"></param>
        /// <returns></returns>
        private string GetFileEx(TypeFile TypeFile)
        {
            switch (TypeFile)
            {
                case TypeFile.JSON:
                    return "json";
                case TypeFile.XML:
                    return "xml";
                default: return "";
            }
        }

    }
}
