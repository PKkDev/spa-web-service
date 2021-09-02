using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Serialization;

namespace WebService.Infrastructure.Entity
{
    [Table("dapartment")]
    [Serializable]
    public class Department
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("department_id")]
        public int? DepartmentId { get; set; }

        public List<Worker> Worker { get; set; }

        [JsonIgnore]
        [XmlIgnore]
        public Department DepartmentMain { get; set; }
        public List<Department> Departments { get; set; }

    }
}
