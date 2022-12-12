namespace BCPServer.Options
{
    public class BCPOptions
    {
        public const string Key = "BCP";
        public BitbucketOptions Bitbucket { get; set; }
        public JiraOptions Jira { get; set; }
        public JenkinsOptions Jenkins { get; set; }
        public DataLakeOptions DataLake { get; set; }
        public DevSecopsOptions DevSecops { get; set; }
        public ServerApplicationOptions ServerApplication { get; set; }
    }
}
