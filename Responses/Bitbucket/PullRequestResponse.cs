namespace BCPServer.Responses.Bitbucket
{
    public class Repository
    {
        public string Slug { get; set; }

        public object Name { get; set; }

        public Project Project { get; set; }
    }

    public class FromRef
    {
        public string Id { get; set; }

        public Repository Repository { get; set; }
    }

    public class ToRef
    {
        public string Id { get; set; }

        public Repository Repository { get; set; }
    }

    public class User
    {
        public string Name { get; set; }

        public string EmailAddress { get; set; }

        public int Id { get; set; }

        public string DisplayName { get; set; }

        public bool Active { get; set; }

        public string Slug { get; set; }

        public string Type { get; set; }
    }

    public class AuthorPullRequest
    {
        public User User { get; set; }

        public string Role { get; set; }

        public bool Approved { get; set; }

        public string Status { get; set; }
    }

    public class Reviewer
    {
        public User User { get; set; }

        public string LastReviewedCommit { get; set; }

        public string Role { get; set; }

        public bool Approved { get; set; }

        public string Status { get; set; }
    }

    public class Participant
    {
        public User User { get; set; }

        public string Role { get; set; }

        public bool Approved { get; set; }

        public string Status { get; set; }
    }

    public class PullRequestResponse
    {
        public int Id { get; set; }

        public int Version { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string State { get; set; }

        public bool Open { get; set; }

        public bool Closed { get; set; }

        public long CreatedDate { get; set; }

        public long UpdatedDate { get; set; }

        public FromRef FromRef { get; set; }

        public ToRef ToRef { get; set; }

        public bool Locked { get; set; }

        public AuthorPullRequest Author { get; set; }

        public List<Reviewer> Reviewers { get; set; }

        public List<Participant> Participants { get; set; }

        public Links Links { get; set; }
    }
}
