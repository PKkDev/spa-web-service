using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebService.Domain.Dto.Post;
using WebService.Domain.Model;

namespace WebService.Domain.ServicesContract
{
    public interface IPostService
    {

        public Task<IEnumerable<PostDto>> GetPosts(CancellationToken ct);
        public Task<PostDto> GetPost(int id, CancellationToken ct);

        public Task<int> GetCountPosts(CancellationToken ct);

        public Task<int> AddPost(PostDto post, CancellationToken ct);

        public Task<int> UpdatePost(int id, PostDto post, CancellationToken ct);
        public Task<bool> UpdatePostFile(List<LoadFileInfo> files, int id, CancellationToken ct);

        public Task<bool> RemovePostAsync(int id, CancellationToken ct);
        public Task<bool> RemovePostFileAsync(int id, string name, CancellationToken ct);

        public Task<byte[]> GetFileAsync(int id, string name, CancellationToken ct);


    }
}
