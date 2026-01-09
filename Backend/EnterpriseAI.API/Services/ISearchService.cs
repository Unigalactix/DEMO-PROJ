namespace EnterpriseAI.API.Services
{
    public interface ISearchService
    {
        Task<string> SearchAsync(string query);
    }
}
