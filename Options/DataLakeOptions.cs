namespace BCPServer.Options
{
    public class DataLakeOptions
    {
        public const string Key = "DataLake";

        public string DataLakeServerHost { get; set; }
        public string HiveServerHost { get; set; }
        public string HivePort { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
