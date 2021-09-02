using System;
using System.Collections.Generic;

namespace WebService.Domain.Dto.Department
{
    public class DepartmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<DepartmentDto> Departments { get; set; }

        public DepartmentDto() { }

        public DepartmentDto(int id, string name, DateTime createdAt)
        {
            Id = id;
            Name = name;
            CreatedAt = createdAt;
            Departments = new List<DepartmentDto>();
        }

        public DepartmentDto(int id, string name, DateTime createdAt, List<DepartmentDto> departments)
            : this(id, name, createdAt)
        {
            Departments = departments;
        }
    }
}
