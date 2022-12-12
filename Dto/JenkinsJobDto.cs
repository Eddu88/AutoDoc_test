namespace BCPServer.Dto
{
    public class JenkinsJobDto
    {
        public string? EnvironmentFolder { get; set; }
        public string? LayerFolder { get; set; }
        public string? NewJobName { get; set; }
        public string? SourceLayerFolder { get; set; }
        public string? SourceJobName { get; set; }
    }
}
