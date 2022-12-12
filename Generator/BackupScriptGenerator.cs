using BCPServer.Dto;
using BCPServer.Options;
using Renci.SshNet;

namespace BCPServer.Generator
{
    /// <summary>
    /// It´s a class to generate scripts of backup
    /// </summary>
    public class BackupScriptGenerator
    {

        private string DataLakeServerHost { get; set; }
        private string UserId { get; set; }
        private string Password { get; set; }
        private string HiveHost { get; set; }
        private string HiveJDBC { get; set; }
        private string PathWebRoot { get; set; }

        /// <summary>
        /// A constructor
        /// </summary>
        /// <param name="bcpOptions">Object with credentials and server data</param>
        /// <param name="webRootPath">Object with wwwroot location path</param>
        public BackupScriptGenerator(BCPOptions bcpOptions, string webRootPath)
        {
            DataLakeServerHost = bcpOptions.DataLake.DataLakeServerHost;
            UserId = bcpOptions.DataLake.UserName;
            Password = bcpOptions.DataLake.Password;
            HiveHost = bcpOptions.DataLake.HiveServerHost;
            HiveJDBC = $"jdbc:hive2://{HiveHost}:{bcpOptions.DataLake.HivePort}/;principal=hive/{HiveHost}@DATALAKE.LOCAL;auth-kerberos";
            PathWebRoot = webRootPath;
        }

        /// <summary>
        /// It takes a table name, and returns a string with the SQL code to create a backup table for
        /// that table
        /// </summary>
        /// <param name="projectName">The name of the project</param>
        /// <param name="schemaName">The name of the schema where the table is located</param>
        /// <param name="tableName">the name of the table to be backed up</param>
        /// <param name="developer">The developer's name</param>
        /// <param name="productOwner">The name of the product owner</param>
        /// <param name="environment">cer, prod</param>
        /// <returns>
        /// A BackupInstructionDto object.
        /// </returns>
        public BackupInstructionDto generate(string projectName, string schemaName, string tableName, string developer, string productOwner, string environment)
        {
            var informationTableList = executeBeelineCommand(schemaName, tableName);
            var tableInformation = processTableInformation(informationTableList);
            var locationTable = getLocation(tableInformation.aditional);
            var columnsTable = getColumns(tableInformation.properties);

            var createTableContent = getBackupCreateTableContent(projectName, schemaName, tableName, developer, productOwner, locationTable, environment);
            var dropTableContent = getBackupDropTableContent(projectName, schemaName, tableName, developer, productOwner, environment);
            var repairTableContent = getBackupRepairTableContent(projectName, schemaName, tableName, developer, productOwner, environment);
            var processBackupTableContent = getBackupProcessContent(projectName, schemaName, tableName, developer, productOwner, locationTable, columnsTable.normalFields, columnsTable.partitionFields, environment);

            return new BackupInstructionDto { 
                CreateTableContent = createTableContent,
                DropTableContent = dropTableContent,
                RepairTableContent = repairTableContent,
                ProcessBackupTableContent = processBackupTableContent
            };
        }

        /// <summary>
        /// It connects to a remote server using SSH, executes a command and returns the structure of table
        /// </summary>
        /// <param name="schema">The schema name</param>
        /// <param name="tableName">The name of the table you want to get the structure from.</param>
        /// <returns>
        /// A list of strings.
        /// </returns>
        private List<string> executeBeelineCommand(string schema, string tableName)
        {
            using (var client = new SshClient(DataLakeServerHost, UserId, Password))
            {
               client.Connect();

               var runner = client.RunCommand($"beeline -u  \"{HiveJDBC}\" -e \"describe formatted {schema}.{tableName}\"");

               client.Disconnect();

               if (runner.ExitStatus != 0)
               {
                   throw new Exception($"No se pudo obtener la estructura de la tabla! [{runner.Error}]");
               }
               return runner.Result.Split("\n").ToList();
            }
        }

        /// <summary>
        /// It takes a list, a start index, and a last index, and returns a list of the items in the
        /// original list between the start and last index
        /// </summary>
        /// <param name="list">The list you want to get the range from.</param>
        /// <param name="startIndex">The index of the first element in the range.</param>
        /// <param name="lastIndex">The last index of the range.</param>
        /// <returns>
        /// A list of strings
        /// </returns>
        private List<string> CRange(List<string> list, int startIndex, int lastIndex)
        {
            return list.GetRange(startIndex, lastIndex - startIndex);
        }

        /// <summary>
        /// It takes a list information of the table and return the properties (columns) and additional
        /// information (partitions)
        /// </summary>
        /// <param name="rows">List of strings, each string is a property of the table</param>
        /// <returns>
        /// A tuple of two lists of strings.
        /// </returns>
        private (List<string> properties, List<string> aditional) processTableInformation(List<string> rows)
        {
            var indexInformation = rows.FindIndex(item => item.Contains("# Detailed Table Information"));

            var propertiesRows = CRange(rows, 5, indexInformation - 1);
            var aditionalRows = CRange(rows, indexInformation + 1, rows.Count - 2);

            return (propertiesRows, aditionalRows);
        }

        /// <summary>
        /// It takes a list of strings, finds the location and return it.
        /// </summary>
        /// <param name="aditionalInfoRows">List of strings that contains the location of the table.</param>
        /// <returns>
        /// The location of the the table.
        /// </returns>
        string getLocation(List<string> aditionalInfoRows)
        {
            var location = aditionalInfoRows.Where(item => item.Contains("Location:")).First().Split("|")[2].Split("hdfs://nameservice-qadev")[1];

            return location.Replace("/desa/", "").Trim();
        }

        /// <summary>
        /// It takes a list of columns of the table and formeted without spaces
        /// </summary>
        /// <param name="fields">List of strings, each string is a field name and data type, separated
        /// by a pipe.</param>
        /// <returns>
        /// A list of tuples (columnName, typeDataColumn).
        /// </returns>
        private List<(string fieldName, string dataType)> formatFields(List<string> fields)
        {
            var fieldsSplited = fields.Select(item => item.Split("|")).ToList();
            var selectedFields = fieldsSplited.Select(item => CRange(item.ToList(), 1, 3)).ToList();
            var formatedFields = selectedFields.Select(item => item.Select(sub => sub.Trim()).ToList()).ToList();
            return formatedFields.Select(item => (item[0], item[1])).ToList();
        }

        /// <summary>
        /// It takes a list of properties of the table, finds the columns and partitions and return its.
        /// </summary>
        /// <param name="propertiesRows">The list of strings that contains the table properties.</param>
        /// <returns>
        /// A tuple of two lists of tuples (partitionColumns, normalColumns).
        /// </returns>
        private (List<(string fieldName, string dataType)> partitionFields, List<(string fieldName, string dataType)> normalFields) getColumns(List<string> propertiesRows)
        {
            var partitionIndex = propertiesRows.FindIndex(item => item.Contains("# Partition Information"));

            var partitionFields = partitionIndex != -1 ? formatFields(CRange(propertiesRows, partitionIndex + 3, propertiesRows.Count)) : new List<(string fieldName, string dataType)>();
            var normalFields = formatFields(partitionIndex != -1 ? CRange(propertiesRows, 0, partitionIndex - 1) : propertiesRows);

            normalFields = normalFields.Except(partitionFields).ToList();

            return (partitionFields, normalFields);
        }

        /// <summary>
        /// It reads a backup script template file, replaces some placeholders with the values passed as parameters
        /// and returns the relative path and the content of the file
        /// </summary>
        /// <param name="projectName">The name of the project</param>
        /// <param name="schemaName">the name of the schema</param>
        /// <param name="tableName">the name of the table</param>
        /// <param name="developer">The name of the developer who is creating the table</param>
        /// <param name="productOwner">The name of the product owner</param>
        /// <param name="location">the path where the file will be saved</param>
        /// <param name="environment">dev, cert, prod</param>
        /// <returns>
        /// A tuple with two values (pathOfFile, contentFile).
        /// </returns>
        private (string realtivePath, string content) getBackupCreateTableContent(string projectName, string schemaName, string tableName, string developer, string productOwner, string location, string environment)
        {
            var realtivePath = $"scripts/{environment.ToUpper()}/{environment.ToUpper()}_DDL_{tableName.ToUpper()}_CREATE_BK.hql";

            var backupTableSource = File.ReadAllText($"{PathWebRoot}/assets/backup_create_table.template");


            var dateNow = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

            var backupTableContent = backupTableSource
                .Replace("{{PROJECT_NAME}}", projectName.ToUpper())
                .Replace("{{AMBIENTE_UPPER}}", environment.ToUpper())
                .Replace("{{TABLE_NAME}}", tableName.ToUpper())
                .Replace("{{SCHEMA_NAME}}", schemaName.ToUpper())
                .Replace("{{SCHEMA_ENV}}", environment == "cert" ? environment.ToUpper() + "_" : "")
                .Replace("{{DATE_NOW}}", dateNow)
                .Replace("{{AMBIENTE}}", environment.ToLower())
                .Replace("{{DEVELOPER}}", developer.ToUpper())
                .Replace("{{PO}}", productOwner.ToUpper())
                .Replace("{{LOCATION_PATH}}", location.ToLower());

            return (realtivePath, backupTableContent);
        }

        /// <summary>
        /// It reads a drop table template file, replaces some placeholders and returns the relative path and the
        /// content of the file
        /// </summary>
        /// <param name="projectName">The name of the project</param>
        /// <param name="schemaName">the name of the schema</param>
        /// <param name="tableName">the name of the table</param>
        /// <param name="developer">The name of the developer who is making the change</param>
        /// <param name="productOwner">The name of the product owner</param>
        /// <param name="environment">the environment where the script will be executed</param>
        /// <returns>
        /// A tuple with two values (pathOfFile, contentFile).
        /// </returns>
        private (string realtivePath, string content) getBackupDropTableContent(string projectName, string schemaName, string tableName, string developer, string productOwner, string environment)
        {
            var realtivePath = $"scripts/{environment.ToUpper()}/{environment.ToUpper()}_DDL_{tableName.ToUpper()}_DROP_BK.hql";

            var deleteBackupTableSource = File.ReadAllText($"{PathWebRoot}/assets/backup_drop_table.template");

            var dateNow = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

            var deleteBackupTableContent = deleteBackupTableSource
                .Replace("{{PROJECT_NAME}}", projectName.ToUpper())
                .Replace("{{AMBIENTE_UPPER}}", environment.ToUpper())
                .Replace("{{TABLE_NAME}}", tableName.ToUpper())
                .Replace("{{SCHEMA_NAME}}", schemaName.ToUpper())
                .Replace("{{SCHEMA_ENV}}", environment == "cert" ? environment.ToUpper() + "_" : "")
                .Replace("{{DEVELOPER}}", developer.ToUpper())
                .Replace("{{PO}}", productOwner.ToUpper())
                .Replace("{{DATE_NOW}}", dateNow);

            return (realtivePath, deleteBackupTableContent);
        }

        /// <summary>
        /// It reads a repair backup template file, replaces some variables and returns the relative path and the
        /// content of the file
        /// </summary>
        /// <param name="projectName">The name of the project</param>
        /// <param name="schemaName">the name of the schema</param>
        /// <param name="tableName">the name of the table</param>
        /// <param name="developer">The name of the developer who is creating the table</param>
        /// <param name="productOwner">"productOwner"</param>
        /// <param name="environment">the environment where the table is located</param>
        /// <returns>
        /// A tuple with two values (pathOfFile, contentFile).
        /// </returns>
        private (string realtivePath, string content) getBackupRepairTableContent(string projectName, string schemaName, string tableName, string developer, string productOwner, string environment)
        {
            var realtivePath = $"scripts/{environment.ToUpper()}/{environment.ToUpper()}_DDL_{tableName.ToUpper()}_MSCK_REPAIR.hql";

            var msckRepairSource = File.ReadAllText($"{PathWebRoot}/assets/backup_msck_repair_table.template");

            var dateNow = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

            var msckRepairContent = msckRepairSource
                .Replace("{{PROJECT_NAME}}", projectName.ToUpper())
                .Replace("{{AMBIENTE_UPPER}}", environment.ToUpper())
                .Replace("{{TABLE_NAME}}", tableName.ToUpper())
                .Replace("{{SCHEMA_NAME}}", schemaName.ToUpper())
                .Replace("{{SCHEMA_ENV}}", environment == "cert" ? environment.ToUpper() + "_" : "")
                .Replace("{{DEVELOPER}}", developer.ToUpper())
                .Replace("{{PO}}", productOwner.ToUpper())
                .Replace("{{DATE_NOW}}", dateNow);

            return (realtivePath, msckRepairContent);
        }

        /// <summary>
        /// It reads a pyspark process to backup data template file, replaces some placeholders with values and returns the relative
        /// path and the content of the file
        /// </summary>
        /// <param name="projectName">The name of the project</param>
        /// <param name="schemaName">the name of the schema</param>
        /// <param name="tableName">the name of the table</param>
        /// <param name="developer">The name of the developer who created the table</param>
        /// <param name="productOwner">The name of the product owner</param>
        /// <param name="location">the path where the files will be saved</param>
        /// <param name="normalFields">List of fields that are not partition fields</param>
        /// <param name="partitionFields">List of fields that are partitions</param>
        /// <param name="environment">the environment where the script will be executed.</param>
        /// <returns>
        /// A tuple with two values (pathOfFile, contentFile).
        /// </returns>
        private (string realtivePath, string content) getBackupProcessContent(string projectName, string schemaName, string tableName, string developer, string productOwner, string location, List<(string fieldName, string dataType)> normalFields, List<(string fieldName, string dataType)> partitionFields, string environment)
        {
            var realtivePath = $"scripts/{environment.ToUpper()}/{environment.ToUpper()}_DDL_{tableName.ToUpper()}_PROCESS_BACKUP.py";

            var fileNameProcessBackup = partitionFields.Any() ? "backup_process" : "backup_process_without_partitions";
            var processBackupSource = File.ReadAllText($"{PathWebRoot}/assets/{fileNameProcessBackup}.template");

            var dateNow = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

            var fieldsInline = normalFields.Select(item => item.fieldName).ToList();

            var partitionsInline = partitionFields.Select(item => item.fieldName).ToList();

            var processBackupContent = processBackupSource
                .Replace("{{PROJECT_NAME}}", projectName.ToUpper())
                .Replace("{{AMBIENTE_UPPER}}", environment.ToUpper())
                .Replace("{{TABLE_NAME}}", tableName.ToUpper())
                .Replace("{{SCHEMA_NAME}}", schemaName.ToUpper())
                .Replace("{{SCHEMA_ENV}}", environment == "cert" ? environment.ToUpper() + "_" : "")
                .Replace("{{DATE_NOW}}", dateNow)
                .Replace("{{AMBIENTE}}", environment.ToLower())
                .Replace("{{LOCATION_PATH}}", location.ToLower())
                .Replace("{{CAMPOS_TABLE}}", String.Join(",", fieldsInline))
                .Replace("{{DEVELOPER}}", developer.ToUpper())
                .Replace("{{PO}}", productOwner.ToUpper())
                .Replace("{{CAMPOS_TABLE_WITH_PARTITIONS}}", string.Join(",", fieldsInline.Concat(partitionsInline)));

            if (partitionFields.Any())
            {
                processBackupContent = processBackupContent
                    .Replace("{{PARTITONS_LIST}}", string.Join(",", partitionsInline))
                    .Replace("{{PARTITON_NAME}}", partitionsInline[0])
                    .Replace("{{PARTITON_NAME_LENGTH}}", (partitionsInline[0].Length + 2).ToString());
            }

            return (realtivePath, processBackupContent);
        }
    }
}

