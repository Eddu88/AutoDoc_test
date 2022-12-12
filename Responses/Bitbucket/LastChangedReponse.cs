namespace BCPServer.Responses.Bitbucket
{
    public class FileDetail
    {
        public string Id { get; set; }
        public string DisplayId { get; set; }
        public Author Author { get; set; }
        public long AuthorTimestamp { get; set; }
        public Committer Committer { get; set; }
        public long CommitterTimestamp { get; set; }
        public string Message { get; set; }
        public List<Parent> Parents { get; set; }
    }
    public class LatestCommit
    {
        public string Id { get; set; }
        public string DisplayId { get; set; }
        public Author Author { get; set; }
        public long AuthorTimestamp { get; set; }
        public Committer Committer { get; set; }
        public long CommitterTimestamp { get; set; }
        public string Message { get; set; }
        public List<Parent> Parents { get; set; }
    }

    public class LastChangedReponse
    {
        public Dictionary<string, FileDetail> Files { get; set; }
        public LatestCommit LatestCommit { get; set; }
    }


}
