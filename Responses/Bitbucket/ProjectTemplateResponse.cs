namespace BCPServer.Responses.Bitbucket
{
    public class ProjectTemplateResponse
    {
        public string Project { get; set; }
        public List<RepositoryTemplateResponse> Repositories { get; set; }
    }
}
