namespace BCPServer.Dto
{
    public class RepositoryTemplateDto : BitbucketDto
    {
        public string? ProjectSource { get; set; }
        public string? RepositorySource { get; set; }
        public string? BranchSource { get; set; }
    }
}
