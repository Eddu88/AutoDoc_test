namespace BCPServer.Responses.Jira
{
    public class CustomFieldResponse
    {
        public string Self { get; set; }
        public string Value { get; set; }
        public string Id { get; set; }
        public List<CustomFieldResponse> Children { get; set; }
    }
}
