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
    /// обработка запросов получения данных по департаментам
    /// </summary>
    [Route("api/department")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private IDepartmentService _service;

        /// <summary>
        /// инициализация
        /// </summary>
        public DepartmentController(IDepartmentService service)
        {
            _service = service;
        }

        /// <summary>
        /// получение сводной информации по департаментам
        /// </summary>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpGet("info")]
        public async Task<AboutDepartamentInfoDto> GetAllDepInfo(
            CancellationToken ct = default)
        {
            return await _service.GetDepartmentInfoAsync(ct);
        }

        /// <summary>
        /// получение списка департаментов с дочерними департаментами
        /// </summary>
        /// <param name="parantId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpGet("children-dep")]
        public async Task<IEnumerable<DepartmentDto>> GetChildrenDepartmentByParantId(
            [FromQuery] int? parantId, CancellationToken ct = default)
        {
            return await _service.GetChildrenDepartmentByParantIdAsync(parantId, ct);
        }

        /// <summary>
        /// удаление департамента
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<bool> RemoveDepartment(
            [FromQuery] int departmentId, CancellationToken ct = default)
        {
            return await _service.RemoveDepartmentAsync(departmentId, ct);
        }

        /// <summary>
        /// изменение департамента
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<bool> UpdateDepartment(
          [FromBody] UpdateDepartmentQuery query, CancellationToken ct = default)
        {
            return await _service.UpdateDepartmentAsync(query.DepartmentId, query.DepartmentName, ct);
        }

        /// <summary>
        /// добавление департамента
        /// </summary>
        /// <param name="query"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<bool> AddDepartment(
          [FromBody] AddDepartmentQuery query, CancellationToken ct = default)
        {
            return await _service.AddDepartmentAsync(query.DepartmentId, query.DepartmentName, ct);
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
            var arrByte = await _service.ExportDepartmentFileAsync(query.DepartmentId, query.TypeFile, ct);
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
            var result = await _service.ImportDepartmentFileAsync(stream, DepartmentId, TypeFile, ct);
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
