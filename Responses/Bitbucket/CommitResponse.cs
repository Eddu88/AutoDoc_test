namespace BCPServer.Responses.Bitbucket
{
    public class CommitResponse
    {
        public string Id { get; set; }
        public string DisplayId { get; set; }
        public Author Author { get; set; }
        public object AuthorTimestamp { get; set; }
        public Committer Committer { get; set; }
        public object CommitterTimestamp { get; set; }
        public string Message { get; set; }
        public List<Parent> Parents { get; set; }
    }
}