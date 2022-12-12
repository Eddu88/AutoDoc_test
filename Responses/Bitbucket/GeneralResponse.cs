namespace BCPServer.Responses.Bitbucket
{
    public class Self
    {
        public string Href { get; set; }
    }
    public class Links
    {
        public List<Self> Self { get; set; }
        public List<Clone> Clone { get; set; }
    }
    public class Author
    {
        public string Name { get; set; }
        public string EmailAddress { get; set; }
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public bool Active { get; set; }
        public string Slug { get; set; }
        public string Type { get; set; }
        public Links Links { get; set; }
    }
    public class Committer
    {
        public string Name { get; set; }
        public string EmailAddress { get; set; }
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public bool Active { get; set; }
        public string Slug { get; set; }
        public string Type { get; set; }
        public Links Links { get; set; }
    }
    public class Parent
    {
        public string Id { get; set; }
        public string DisplayId { get; set; }
    }

    public class Project
    {
        public string Key { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public bool @Public { get; set; }
        public string Type { get; set; }
        public Links Links { get; set; }
    }

    public class Clone
    {
        public string Href { get; set; }
        public string Name { get; set; }
    }
}
