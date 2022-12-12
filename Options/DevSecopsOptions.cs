namespace BCPServer.Options
{
    public class DevSecopsOptions
    {
        public const string Key = "DevSecops";

        public List<RepositoryTemplate> Templates { get; set; }
    }

    public class RepositoryTemplate 
    {
        public string Project { get; set; }
        public List<string> Repositories { get; set; }
    }
}
