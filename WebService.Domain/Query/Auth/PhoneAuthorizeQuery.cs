namespace WebService.Domain.Query.Auth
{
    public class PhoneAuthorizeQuery
    {
        public string Phone { get; set; }
    }

    public class CheckPhoneAuthorizeQuery : PhoneAuthorizeQuery
    {
        public string Code { get; set; }
    }
}
