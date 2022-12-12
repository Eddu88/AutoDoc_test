namespace BCPServer.Dto
{
    public class PullRequestDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string State { get; set; }
        public bool Open { get; set; }
        public bool Closed { get; set; }
        public BranchReferenceDto FromRef { get; set; }
        public BranchReferenceDto ToRef { get; set; }
        public bool Locked { get; set; }
        public List<object> Reviewers { get; set; }
    }
    public class BranchReferenceDto
    {
        public string Id { get; set; }
    }
}
