namespace BCPServer.Options
{
    public class ServerApplicationOptions
    {
        public const string Key = "ServerApplication";

        public string Project { get; set; }
        public string Repository { get; set; }
        public string Path { get; set; }
        public bool VerifyEnabled { get; set; }
    }
}
