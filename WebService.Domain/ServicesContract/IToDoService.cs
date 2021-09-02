using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.ToDo;
using WebService.Domain.Query.ToDo;

namespace WebService.Domain.ServicesContract
{
    public interface IToDoService
    {
        public Task<int> GetCountRecordAsync
          (int IdUser, CancellationToken ct);

        public Task<IEnumerable<ToDoRecordDto>> GetToDoRecordsAsync
            (GetToDoQuery query, CancellationToken ct);

        public Task<bool> RemoveTodoRecordAsync
           (int IdRecord, int IdUser, CancellationToken ct);

        public Task<bool> UpdateTodoRecordAsync
         (ToDoRecordDto Record, int IdUser, CancellationToken ct);

        public Task<bool> AddTodoRecordAsync
        (ToDoRecordDto Record, int IdUser, CancellationToken ct);

        public Task<byte[]> GetExportFileAsync
            (GetToDoQuery query, CancellationToken ct);

        public Task<bool> ImportFIleAsync
           (Stream stream, int IdUser, CancellationToken ct);
    }
}
