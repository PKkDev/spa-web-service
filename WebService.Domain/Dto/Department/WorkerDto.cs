namespace WebService.Domain.Dto.Department
{
    public class WorkerDto
    {
        public int? Id { get; set; }
        public string LName { get; set; }
        public string FName { get; set; }
        public int Age { get; set; }
        public int Salary { get; set; }

        public WorkerDto() { }

        public WorkerDto(int? id, string lName, string fName, int age, int salary)
        {
            Id = id;
            LName = lName;
            FName = fName;
            Age = age;
            Salary = salary;
        }
    }
}
