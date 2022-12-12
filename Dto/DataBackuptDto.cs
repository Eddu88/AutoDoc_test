namespace BCPServer.Dto
{
    public class DataBackuptDto : BitbucketDto
    {
        public string? ProjectName { get; set; }
        public string? Developer { get; set; }
        public string? ProductOwner { get; set; }
        public string? SchemaName { get; set; }
        public string? TableName { get; set; }
    }
}
