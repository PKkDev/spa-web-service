using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.Department;
using WebService.Domain.Model;
using WebService.Domain.ServicesContract;
using WebService.Infrastructure.Context;
using WebService.Infrastructure.Entity;
using Newtonsoft.Json;
using System.Text;
using System.Xml.Serialization;

namespace WebService.Infrastructure.Services
{
    public class DepartmentService : IDepartmentService
    {
        private ApplicationContext _context;

        public DepartmentService(ApplicationContext context)
        {
            _context = context;
        }

        /// <summary>
        /// получение сводной информации по департаментам
        /// </summary>
        /// <param name="ct"></param>
        /// <returns></returns>
        public async Task<AboutDepartamentInfoDto> GetDepartmentInfoAsync(
            CancellationToken ct)
        {
            var result = new AboutDepartamentInfoDto();

            var departments = await _context.Department.CountAsync(ct);
            var workers = await _context.Worker.CountAsync(ct);

            result.CountDepartment = departments;
            result.CountWorkers = workers;

            return result;
        }

        #region crud dep

        public async Task<IEnumerable<DepartmentDto>> GetChildrenDepartmentByParantIdAsync(
           int? parantId, CancellationToken ct)
        {
            var result = new List<DepartmentDto>();

            var mainDep = await _context.Department
                   .Where(x => x.DepartmentId == parantId)
                   .ToListAsync(ct);

            if (mainDep.Any())
            {

                foreach (var dep in mainDep)
                {
                    result.Add(new DepartmentDto(dep.Id, dep.Name, dep.CreatedAt));
                }
            }

            return result;
        }

        public async Task<bool> AddDepartmentAsync(
           int? parenDepId, string newName, CancellationToken ct)
        {
            try
            {
                var newDep = new Department();
                newDep.CreatedAt = DateTime.Now;
                newDep.Name = newName;
                newDep.DepartmentId = parenDepId;

                await _context.Department.AddAsync(newDep, ct);
                await _context.SaveChangesAsync(ct);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> RemoveDepartmentAsync(
             int departmentId, CancellationToken ct)
        {
            try
            {
                var dep = await _context.Department
                    .FirstOrDefaultAsync(x => x.Id == departmentId, ct);

                if (dep == null)
                    return false;

                _context.Department.Remove(dep);
                await _context.SaveChangesAsync(ct);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateDepartmentAsync(
             int departmentId, string newName, CancellationToken ct)
        {
            try
            {
                var dep = await _context.Department
                   .FirstOrDefaultAsync(x => x.Id == departmentId, ct);

                if (dep == null)
                    return false;

                dep.Name = newName;

                _context.Department.Update(dep);
                await _context.SaveChangesAsync(ct);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        #endregion

        #region department - export/import

        public async Task<byte[]> ExportDepartmentFileAsync(
            int departmentId, TypeFile typeFile, CancellationToken ct)
        {
            try
            {
                var departments = await _context.Department
                    .Where(x => x.Id == departmentId)
                    .Include(x => x.Departments)
                    .ToListAsync();

                await RecursAddDep(departments.First());

                switch (typeFile)
                {
                    case TypeFile.JSON:
                        {
                            var departmentStr = JsonConvert.SerializeObject(departments);
                            return Encoding.UTF8.GetBytes(departmentStr);

                        }
                    case TypeFile.XML:
                        {
                            XmlSerializer formatter = new XmlSerializer(typeof(List<Department>));
                            using MemoryStream stream = new MemoryStream();
                            formatter.Serialize(stream, departments);
                            return stream.ToArray();
                        }
                    default: return Array.Empty<byte>();
                }
            }
            catch (Exception e)
            {
                return Array.Empty<byte>();
            }
        }

        private async Task RecursAddDep(Department department)
        {
            await _context.Entry(department)
                .Collection(x => x.Departments)
                .LoadAsync();

            if (department.Departments != null)
            {
                foreach (var dep in department.Departments)
                {
                    await RecursAddDep(dep);
                }
            }

        }

        public async Task<bool> ImportDepartmentFileAsync(
            Stream stream, int departmentId, TypeFile typeFile, CancellationToken ct)
        {
            try
            {
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        #endregion

        #region crud worker

        public async Task<IEnumerable<WorkerDto>> GetDepartmentWorkersAsync(
           int departmentId, CancellationToken ct)
        {
            List<WorkerDto> result = new List<WorkerDto>();
            try
            {

                result = await _context.Worker
                    .Where(x => x.DepartmentId == departmentId)
                    .Select(y => new WorkerDto(y.Id, y.LastName, y.Name, y.Age, y.Salary))
                    .ToListAsync(ct);

            }
            catch (Exception e)
            {

            }
            return result;
        }

        public async Task<bool> AddWorkerAsync(
             int departmentId, WorkerDto newWorker, CancellationToken ct)
        {
            try
            {
                var worker = new Worker();

                worker.Name = newWorker.FName;
                worker.LastName = newWorker.LName;
                worker.Age = newWorker.Age;
                worker.Salary = newWorker.Salary;
                worker.DepartmentId = departmentId;

                await _context.Worker.AddAsync(worker, ct);
                await _context.SaveChangesAsync(ct);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> RemoveWorkerAsync(
            int workerId, CancellationToken ct)
        {
            try
            {
                var worker = await _context.Worker
                    .FirstOrDefaultAsync(x => x.Id == workerId, ct);

                if (worker == null)
                    return false;

                _context.Worker.Remove(worker);
                await _context.SaveChangesAsync(ct);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateWorkerAsync(
            WorkerDto newWorker, CancellationToken ct)
        {
            try
            {
                var worker = await _context.Worker
                    .FirstOrDefaultAsync(x => x.Id == newWorker.Id, ct);

                if (worker == null)
                    return false;

                worker.Name = newWorker.FName;
                worker.LastName = newWorker.LName;
                worker.Age = newWorker.Age;
                worker.Salary = newWorker.Salary;

                _context.Worker.Update(worker);
                await _context.SaveChangesAsync(ct);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        #endregion

        #region worker - export/import

        public async Task<byte[]> ExportWorkerFileAsync(
            int departmentId, TypeFile typeFile, CancellationToken ct)
        {
            try
            {
                var workers = await _context.Worker
                    .Where(x => x.DepartmentId == departmentId)
                    .ToListAsync();

                switch (typeFile)
                {
                    case TypeFile.JSON:
                        {
                            var workerStr = JsonConvert.SerializeObject(workers);
                            return Encoding.UTF8.GetBytes(workerStr);

                        }
                    case TypeFile.XML:
                        {
                            XmlSerializer formatter = new XmlSerializer(typeof(List<Worker>));
                            using MemoryStream stream = new MemoryStream();
                            formatter.Serialize(stream, workers);
                            return stream.ToArray();
                        }
                    default: return Array.Empty<byte>();
                }
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public async Task<bool> ImportWorkerFileAsync(
            Stream stream, int departmentId, TypeFile typeFile, CancellationToken ct)
        {
            try
            {
                switch (typeFile)
                {
                    case TypeFile.JSON:
                        {
                            using StreamReader sr = new StreamReader(stream);
                            var workerStr = await sr.ReadToEndAsync();
                            var workers = JsonConvert.DeserializeObject<IEnumerable<Worker>>(workerStr);

                            _context.Worker.AddRange(workers);
                            await _context.SaveChangesAsync(ct);

                            return true;
                        }
                    case TypeFile.XML:
                        {
                            XmlSerializer formatter = new XmlSerializer(typeof(List<Worker>));
                            List<Worker> workers = (List<Worker>)formatter.Deserialize(stream);

                            _context.Worker.AddRange(workers);
                            await _context.SaveChangesAsync(ct);

                            return true;
                        }
                    default: throw new ArgumentException();
                }
            }
            catch (Exception e)
            {
                throw;
            }
        }

        #endregion

    }
}
