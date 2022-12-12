namespace BCPServer.Responses.Bitbucket
{
    public class BranchResponse
    {
        public string Id { get; set; }
        public string DisplayId { get; set; }
        public string Type { get; set; }
        public string LatestCommit { get; set; }
        public string LatestChangeset { get; set; }
        public bool IsDefault { get; set; }
    }
}
