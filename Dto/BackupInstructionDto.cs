namespace BCPServer.Dto
{
    public class BackupInstructionDto
    {
        public (string realtivePath, string content) CreateTableContent { get; set; }
        public (string realtivePath, string content) DropTableContent { get; set; }
        public (string realtivePath, string content) RepairTableContent { get; set; }
        public (string realtivePath, string content) ProcessBackupTableContent { get; set; }
    }
}
