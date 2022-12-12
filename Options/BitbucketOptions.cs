namespace BCPServer.Options
{
    public class BitbucketOptions
    {
        public const string Key = "Bitbucket";

        public string HostSDLC { get; set; }
        public string HostLegacy { get; set; }
        public string TokenLegacy { get; set; }
        public string TokenSDLC { get; set; }
        public string ConstructionBranch { get; set; }
        public string DevelopBranch { get; set; }
        public string MasterBranch { get; set; }
        public string VersionFile { get; set; }

    }
}
