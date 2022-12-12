namespace BCPServer.Responses.Jenkins
{
    public class JobResponse
    {
        private readonly string _hostJenkins;
        public JobResponse(string host)
        {
            _hostJenkins = host;
        }

        public string? EnvironmentFolder { get; set; }
        public string? LayerFolder { get; set; }
        public string? JobName { get; set; }
        public string Url
        {
            get { return $"{_hostJenkins}/job/{EnvironmentFolder}/job/{LayerFolder}/job/{JobName}"; }
        }
    }
}
