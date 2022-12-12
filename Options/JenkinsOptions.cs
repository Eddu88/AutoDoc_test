namespace BCPServer.Options
{
    public class JenkinsOptions
    {
        public const string Key = "Jenkins";

        public string Host { get; set; }
        public string EnvironmentFolder { get; set; }
        public string SourceLayer { get; set; }
        public string SourceJobDev { get; set; }
        public string SourceJobCert { get; set; }
        public string SourceJobProd { get; set; }
    }
}
