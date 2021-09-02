namespace WebService.Domain.Dto.Auth
{
    public class LoginResponseDto
    {
        public int Id { get; set; }
        public string Token { get; set; }

        public LoginResponseDto(int id, string token)
        {
            Id = id;
            Token = token;
        }
    }
}
