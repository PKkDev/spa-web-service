using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Xml.Serialization;

namespace WebService.Infrastructure.Entity
{
    [Table("worker")]
    [Serializable]
    public class Worker
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int? Id { get; set; }

        [Column("last_name")]
        public string LastName { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("age")]
        public int Age { get; set; }

        [Column("department_id")]
        public int DepartmentId { get; set; }

        [Column("salary")]
        public int Salary { get; set; }

        [JsonIgnore]
        [XmlIgnore]
        public Department Department { get; set; }
    }
}
