using WebService.Domain.ServicesContract;
using WebService.Infrastructure.Context;
using WebService.Infrastructure.Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.Post;
using WebService.Domain.Model;

namespace WebService.Infrastructure.Services
{
    public class PostService : IPostService
    {
        private readonly ApplicationContext _context;

        private readonly string[] SizeSuffixes =
                  { "bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" };

        public PostService(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<int> GetCountPosts(CancellationToken ct)
        {
            return await _context.Post.CountAsync(ct);
        }


        public async Task<PostDto> GetPost(int id, CancellationToken ct)
        {
            var post = await _context.Post
               .Include(x => x.PostFile)
                .Select(x => new PostDto()
                {
                    Author = x.Author,
                    Date = x.Date,
                    Edited = x.Edited,
                    Id = x.Id,
                    Text = x.Text,
                    FileDescDto = x.PostFile
                    .Select(y => new FileDescDto()
                    {
                        Name = y.Name,
                        SizeByte = y.Size
                    }).ToList()
                })
                .FirstOrDefaultAsync(ct);

            if (post.FileDescDto.Any())
                foreach (var f in post.FileDescDto)
                    f.Size = BiteConvert(f.SizeByte, 2);


            return post;
        }
        public async Task<IEnumerable<PostDto>> GetPosts(CancellationToken ct)
        {
            var result = new List<PostDto>();

            var posts = await _context.Post
                .Include(x => x.PostFile)
                .Select(x => new PostDto()
                {
                    Author = x.Author,
                    Date = x.Date,
                    Edited = x.Edited,
                    Id = x.Id,
                    Text = x.Text,
                    FileDescDto = x.PostFile
                    .Select(y => new FileDescDto()
                    {
                        Name = y.Name,
                        SizeByte = y.Size
                    }).ToList()
                })
                .ToListAsync(ct);

            if (posts.Any())
                foreach (var p in posts)
                    foreach (var f in p.FileDescDto)
                        f.Size = BiteConvert(f.SizeByte, 2);

            return posts;
        }


        public async Task<int> AddPost(PostDto post, CancellationToken ct)
        {
            try
            {
                var newPost = new Post();
                newPost.Author = post.Author;
                newPost.Date = DateTime.Now;
                newPost.Text = post.Text;
                newPost.Edited = false;
                newPost.PostFile = new List<PostFile>();
                var result = await _context.Post.AddAsync(newPost, ct);
                await _context.SaveChangesAsync(ct);
                return result.Entity.Id;
            }
            catch (Exception)
            {
                return -1;
            }
        }


        public async Task<bool> RemovePostAsync(int id, CancellationToken ct)
        {
            try
            {
                var post = await _context.Post.FirstOrDefaultAsync(x => x.Id == id);
                if (post != null)
                {
                    _context.Post.Remove(post);
                    await _context.SaveChangesAsync(ct);
                    return true;
                }

                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> RemovePostFileAsync(int id, string name, CancellationToken ct)
        {
            try
            {
                var post = await _context.Post
                    .Include(x => x.PostFile)
                    .FirstOrDefaultAsync(x => x.Id == id);
                if (post != null)
                {
                    var file = post.PostFile.Find(x => x.Name.Equals(name));
                    if (file != null)
                    {
                        _context.PostFile.Remove(file);
                        await _context.SaveChangesAsync(ct);
                        return true;
                    }
                }

                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }


        public async Task<int> UpdatePost(int id, PostDto post, CancellationToken ct)
        {
            try
            {
                var oldPost = await _context.Post.FirstOrDefaultAsync(x => x.Id == id);
                if (oldPost != null)
                {
                    oldPost.Author = post.Author;
                    oldPost.Date = DateTime.Now;
                    oldPost.Edited = true;
                    oldPost.Text = post.Text;
                    _context.Post.Update(oldPost);
                    await _context.SaveChangesAsync(ct);
                    return oldPost.Id;
                }
                return -1;
            }
            catch (Exception)
            {
                return -1;
            }
        }

        public async Task<bool> UpdatePostFile(List<LoadFileInfo> files, int id, CancellationToken ct)
        {
            try
            {
                var post = await _context.Post
                    .Include(x => x.PostFile)
                    .Where(x => x.Id == id)
                    .FirstOrDefaultAsync(ct);

                if (post != null)
                {
                    var listEntityFile = new List<PostFile>();
                    foreach (var file in files)
                    {
                        listEntityFile.Add(new PostFile()
                        {
                            Size = file.Size,
                            File = file.FileByte,
                            Name = file.Name,
                            IdPost = post.Id
                        });
                    }

                    if (listEntityFile.Any())
                    {
                        post.PostFile.AddRange(listEntityFile);
                        _context.Post.Update(post);
                        await _context.SaveChangesAsync(ct);
                    }
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }



        private string BiteConvert(long value, int decimalPlaces = 1)
        {
            try
            {
                if (value < 0) { return "-" + BiteConvert(-value); }

                int i = 0;
                decimal dValue = (decimal)value;
                while (Math.Round(dValue, decimalPlaces) >= 1000)
                {
                    dValue /= 1024;
                    i++;
                }

                return string.Format("{0:n" + decimalPlaces + "} {1}", dValue, SizeSuffixes[i]);
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public async Task<byte[]> GetFileAsync(int id, string name, CancellationToken ct)
        {
            try
            {
                var post = await _context.Post
                    .Include(x => x.PostFile)
                    .Where(x => x.Id == id)
                    .FirstOrDefaultAsync(ct);

                if (post != null)
                {
                    var file = post.PostFile.Find(x => x.Name.Equals(name));

                    if (file != null)
                    {
                        return file.File;
                    }
                }

                return new byte[0];
            }
            catch (Exception)
            {
                return new byte[0];
            }
        }
    }
}
