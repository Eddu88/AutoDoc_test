namespace BCPServer.Responses.Jira
{
    public class CustomFieldValueResponse
    {
        public string Group { get; set; }
        public List<string> Security { get; set; }
        public List<string> GroupAgileOps { get; set; }
        public List<string> Gobernance { get; set; }
        public List<string> ProductOwner { get; set; }
        public List<string> TechnicalLead { get; set; }
        public List<string> QualityAssurance { get; set; }
        public List<string> SourceMVP { get; set; }
        public List<string> TypeRequirement { get; set; }
    }
}
