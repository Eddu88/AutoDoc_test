namespace BCPServer.Responses.Bitbucket
{
    public class PullRequestChangeResponse
    {
        public string ContentId { get; set; }
        public string FromContentId { get; set; }
        public Path Path { get; set; }
        public bool Executable { get; set; }
        public int PercentUnchanged { get; set; }
        public string Type { get; set; }
        public string NodeType { get; set; }
        public bool SrcExecutable { get; set; }
        public Links Links { get; set; }
        public Properties Properties { get; set; }
    }

    public class Path
    {
        public List<string> Components { get; set; }
        public string Parent { get; set; }
        public string Name { get; set; }
        public new string ToString { get; set; }
    }

    public class Properties
    {
        public string ChangeScope { get; set; }
        public string GitChangeType { get; set; }
    }
}
