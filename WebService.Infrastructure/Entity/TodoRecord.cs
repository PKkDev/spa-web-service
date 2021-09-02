using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebService.Infrastructure.Entity
{
    [Table("todo_records")]
    public class TodoRecord
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [Column("text")]
        public string Text { get; set; }

        [Column("id_user")]
        public int IdUser { get; set; }

        [Column("date_create")]
        public DateTime DateCreate { get; set; }


        public User User { get; set; }
    }
}
