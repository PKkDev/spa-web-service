using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebService.Infrastructure.Entity
{
    [Table("post")]
    public class Post
    {
        [Column("id")]
        [Key]
        public int Id { get; set; }

        [Column("author")]
        public string Author { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }

        [Column("edited")]
        public bool Edited { get; set; }

        [Column("text")]
        public string Text { get; set; }

        public List<PostFile> PostFile { get; set; }

    }
}
