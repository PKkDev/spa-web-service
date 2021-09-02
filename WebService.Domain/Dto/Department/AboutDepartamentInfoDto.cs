namespace WebService.Domain.Dto.Department
{
    public class AboutDepartamentInfoDto
    {
        public int CountDepartment { get; set; }
        public int CountWorkers { get; set; }

        public AboutDepartamentInfoDto()
        {
            CountDepartment = 0;
            CountWorkers = 0;
        }
    }
}
