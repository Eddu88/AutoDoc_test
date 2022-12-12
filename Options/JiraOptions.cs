namespace BCPServer.Options
{
    public class JiraOptions
    {
        public const string Key = "Jira";

        public string UserName { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public string TicketSource { get; set; }
    }
}
