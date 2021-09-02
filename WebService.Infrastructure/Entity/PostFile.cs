using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebService.Infrastructure.Entity
{
    [Table("post_file")]
    public class PostFile
    {
        [Column("id")]
        [Key]
        public int Id { get; set; }

        [Column("size")]
        public long Size { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("id_post")]
        public int IdPost { get; set; }

        [Column("file")]
        public byte[] File { get; set; }

        public Post Post { get; set; }

    }
}
