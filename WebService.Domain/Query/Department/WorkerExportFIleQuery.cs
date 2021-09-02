using WebService.Domain.Model;

namespace WebService.Domain.Query.Department
{
    public class WorkerExportFIleQuery
    {
        public int DepartmentId { get; set; }
        public TypeFile TypeFile { get; set; }
    }
}
