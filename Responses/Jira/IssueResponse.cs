namespace BCPServer.Responses.Jira
{
    public class IssueResponse
    {
        private readonly string _hostJira;
        public IssueResponse(string hostJira)
        {
            _hostJira = hostJira;
        }

        public string Id { get; set; }

        public string Url
        {
            get { return $"{_hostJira}/browse/{Id}"; }
        }

    }
}
