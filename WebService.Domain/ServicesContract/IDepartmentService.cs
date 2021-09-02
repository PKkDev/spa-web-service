using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.Department;
using WebService.Domain.Model;

namespace WebService.Domain.ServicesContract
{
    public interface IDepartmentService
    {
        /// <summary>
        /// получение сводной информации по системе
        /// </summary>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<AboutDepartamentInfoDto> GetDepartmentInfoAsync(
            CancellationToken ct);

        #region crud dep

        /// <summary>
        /// получение списка дочерних департаментов
        /// </summary>
        /// <param name="parantId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<IEnumerable<DepartmentDto>> GetChildrenDepartmentByParantIdAsync(
          int? parantId, CancellationToken ct);

        /// <summary>
        /// добавление департамента
        /// </summary>
        /// <param name="parenDepId"></param>
        /// <param name="newName"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<bool> AddDepartmentAsync(
            int? parenDepId, string newName, CancellationToken ct);

        /// <summary>
        /// удаление департамента
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<bool> RemoveDepartmentAsync(
            int departmentId, CancellationToken ct);

        /// <summary>
        /// изменение департамента
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="newName"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<bool> UpdateDepartmentAsync(
            int departmentId, string newName, CancellationToken ct);

        #endregion

        #region crud worker

        /// <summary>
        /// получение списка сотрудников департамента
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<IEnumerable<WorkerDto>> GetDepartmentWorkersAsync(
            int departmentId, CancellationToken ct);

        /// <summary>
        /// добавление сотрудника
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="newWorker"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<bool> AddWorkerAsync(
           int departmentId, WorkerDto newWorker, CancellationToken ct);

        /// <summary>
        /// удаление сотрудника
        /// </summary>
        /// <param name="workerId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<bool> RemoveWorkerAsync(
          int workerId, CancellationToken ct);

        /// <summary>
        /// изменение сотрудника
        /// </summary>
        /// <param name="newWorker"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task<bool> UpdateWorkerAsync(
          WorkerDto newWorker, CancellationToken ct);

        #endregion

        #region worker - export/import

        /// <summary>
        /// экспорт сотрудников
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="typeFile"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        public Task<byte[]> ExportWorkerFileAsync(
            int departmentId, TypeFile typeFile, CancellationToken ct);

        /// <summary>
        /// импорт сотрудников
        /// </summary>
        /// <param name="stream"></param>
        /// <param name="departmentId"></param>
        /// <param name="TypeFile"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        public Task<bool> ImportWorkerFileAsync(
            Stream stream, int departmentId, TypeFile TypeFile, CancellationToken ct);

        #endregion

        #region worker - export/import

        /// <summary>
        /// экспорт департаментов
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="typeFile"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        public Task<byte[]> ExportDepartmentFileAsync(
            int departmentId, TypeFile typeFile, CancellationToken ct);

        /// <summary>
        /// импорт департаментов
        /// </summary>
        /// <param name="stream"></param>
        /// <param name="departmentId"></param>
        /// <param name="TypeFile"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        public Task<bool> ImportDepartmentFileAsync(
            Stream stream, int departmentId, TypeFile TypeFile, CancellationToken ct);

        #endregion
    }
}
