using Microsoft.EntityFrameworkCore;
using WebService.Infrastructure.Entity;

namespace WebService.Infrastructure.Context
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> User { get; set; }

        public DbSet<TodoRecord> TodoRecord { get; set; }

        public DbSet<Post> Post { get; set; }
        public DbSet<PostFile> PostFile { get; set; }

        public DbSet<Department> Department { get; set; }
        public DbSet<Worker> Worker { get; set; }

        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Worker>()
                .Property<int>("DepartmentId");

            modelBuilder.Entity<Worker>()
                .HasOne(p => p.Department)
                .WithMany(b => b.Worker)
                .HasForeignKey("DepartmentId")
                .HasPrincipalKey(y => y.Id);

            modelBuilder.Entity<Department>()
                .Property<int?>("DepartmentId");

            modelBuilder.Entity<Department>()
                .HasOne(p => p.DepartmentMain)
                .WithMany(b => b.Departments)
                .HasForeignKey("DepartmentId")
                .HasPrincipalKey(y => y.Id);

            modelBuilder.Entity<PostFile>()
                .HasOne(p => p.Post)
                .WithMany(b => b.PostFile)
                .HasForeignKey(p => p.IdPost);

            modelBuilder.Entity<TodoRecord>()
                .HasOne(p => p.User)
                .WithMany(b => b.TodoRecords)
                .HasForeignKey(p => p.IdUser);
        }
    }
}
