namespace BCPServer.Dto
{
    public class IssueDto
    {
        public string? Project { get; set; }
        public string? Type { get; set; }
        public string? Group { get; set; }
        public string? Summary { get; set; }
        public string? Description { get; set; }
        public string? Security { get; set; }
        public string? GroupAgileOps { get; set; }
        public string? Gobernance { get; set; }
        public string? ProductOwner { get; set; }
        public string? TechnicalLead { get; set; }
        public string? QualityAssurance { get; set; }
        public string? SourceMVP { get; set; }
        public string? TypeRequirement { get; set; }
        public string? NumberTicket { get; set; }
        public string? CertificationInstruction { get; set; }
        public string? ProductionInstruction { get; set; }
        public string? ReversionInstruction { get; set; }
        public BitbucketDto? ProccessBitbucket { get; set; }
        public BitbucketDto? MetadataBitbucket { get; set; }
        public BitbucketDto? LinajeBitbucket { get; set; }
        public string? CommitId { get; set; }
        public bool GeneratePullRequest { get; set; }
    }
}
