using BCPServer.Dto;
using BCPServer.Generator;
using BCPServer.Options;
using BCPServer.Responses.Bitbucket;
using BCPServerControllers;
using BCPServerServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BCPServer.Controllers
{
    /// <summary>
    /// Bitbucket SDLC Controller Class
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
    public class BitbucketController : GenericController
    {
        private readonly BitbucketService _bitbucketService;
        private readonly IWebHostEnvironment _environment;
        private readonly int PAGE_LIMIT_BITBUCKTE = 50;

        /// <summary>
        /// A constructor
        /// </summary>
        /// <param name="bcpOptions">Object with credentials and server data</param>
        /// <param name="logger">Logger</param>
        public BitbucketController(IOptions<BCPOptions> bcpOptions, ILogger<GenericController> logger, IWebHostEnvironment environment)
            : base(bcpOptions, logger)
        {
            _bitbucketService = new BitbucketService(_bcpOptions.Bitbucket.HostSDLC, _bcpOptions.Bitbucket.TokenSDLC);
            _environment = environment;
        }

        /// <summary>
        /// It gets the last commit id of a branch in a repository in a project
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="branch">The branch you want to get the last commit from.</param>
        /// <returns>
        /// The last commit id for the specified project, repository and branch.
        /// </returns>
        [HttpGet("LastCommit/{project}/{repository}/{branch}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BitbucketResponse<CommitResponse>))]
        public async Task<IActionResult> GetLastCommitIdAsync(string project, string repository, string branch)
        {
            try
            {
                var request = await _bitbucketService.GetLastCommitAsync(project, repository, branch);

                return Ok(request);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(errorMessage);
            }
        }
        
        /// <summary>
        /// It's a simple health check that calls the Bitbucket API to check if the user exists
        /// </summary>
        /// <returns>
        /// A boolean value.
        /// </returns>
        [HttpGet("CheckHealth")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(bool))]
        public async Task<IActionResult> CheckHealth()
        {
            try
            {
                var request = await _bitbucketService.ComprobeUserAsync(_bcpOptions.Jira.UserName);

                _logger.LogInformation(request);

                return Ok(true);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(false);
            }
        }

        /// <summary>
        /// It checks if the version of the file on the server is the same as the version of the file on
        /// the client
        /// </summary>
        /// <returns>
        /// The version of the application that is currently running on the server.
        /// </returns>
        [HttpGet("LastVersion")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(bool))]
        public async Task<IActionResult> GetLastVersion()
        {
            try
            {
                if(!_bcpOptions.ServerApplication.VerifyEnabled) return Ok(true);
                
                var request = await _bitbucketService.GetFileNamesAsync(_bcpOptions.ServerApplication.Project, _bcpOptions.ServerApplication.Repository, _bcpOptions.Bitbucket.MasterBranch, _bcpOptions.ServerApplication.Path);

                var fileBundle = request != null && request.Values.Any() ? request.Values.Where(file => file.EndsWith(".js")).FirstOrDefault() : null;
                var versionFromServer = fileBundle.Split(".")[1];
                
                var filesFromLocal = Directory.GetFiles(_environment.WebRootPath, "*.js")
                    .Select(item => { 
                        var itemSplited = item.Split(".");
                        return itemSplited[itemSplited.Count() - 2];
                    }).ToList();
                var listOfVersions = string.Join(", ", filesFromLocal);

                _logger.LogInformation($"[CheckVersion] Version from remote: {versionFromServer}");
                _logger.LogInformation($"[CheckVersion] Version from local: {listOfVersions}");

                return Ok(filesFromLocal.Contains(versionFromServer));
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(false);
            }
        }

        /// <summary>
        /// It takes in a DataBackuptDto object, Create a BackupScriptGenerator for a table
        /// </summary>
        /// <param name="data">The parameters to generate the table backup.</param>
        /// <returns>
        /// The response is a JSON object with the following properties: Url, Project, Repository
        /// </returns>
        [HttpPost("GenerateBackupScripts")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RepositoryInfoResponse))]
        public async Task<IActionResult> GetGenerateBackupScripts(DataBackuptDto data)
        {
            try
            {
                BackupScriptGenerator generator = new BackupScriptGenerator(_bcpOptions, _environment.WebRootPath);

                var certificaction = generator.generate(data.ProjectName, data.SchemaName, data.TableName, data.Developer, data.ProductOwner, "cert");
                var production = generator.generate(data.ProjectName, data.SchemaName, data.TableName, data.Developer, data.ProductOwner, "prod");

                var certificationCreateTableUpdate = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, certificaction.CreateTableContent.realtivePath, certificaction.CreateTableContent.content);
                var certificationDropTableUpdate = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, certificaction.DropTableContent.realtivePath, certificaction.DropTableContent.content);
                var certificationRepairTableUpdate = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, certificaction.RepairTableContent.realtivePath, certificaction.RepairTableContent.content);
                var certificationProcessBackupTableUpdate = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, certificaction.ProcessBackupTableContent.realtivePath, certificaction.ProcessBackupTableContent.content);
                var productionCreateTableUpdate = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, production.CreateTableContent.realtivePath, production.CreateTableContent.content);
                var productionDropTableUpdate = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, production.DropTableContent.realtivePath, production.DropTableContent.content);
                var productionRepairTableUpdate = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, production.RepairTableContent.realtivePath, production.RepairTableContent.content);
                var productionProcessBackupTableUpdate = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, production.ProcessBackupTableContent.realtivePath, production.ProcessBackupTableContent.content);

                _logger.LogInformation(certificationCreateTableUpdate);
                _logger.LogInformation(certificationDropTableUpdate);
                _logger.LogInformation(certificationRepairTableUpdate);
                _logger.LogInformation(certificationProcessBackupTableUpdate);
                _logger.LogInformation(productionCreateTableUpdate);
                _logger.LogInformation(productionDropTableUpdate);
                _logger.LogInformation(productionRepairTableUpdate);
                _logger.LogInformation(productionProcessBackupTableUpdate);

                return Ok(new RepositoryInfoResponse()
                {
                    Url = $"{_bcpOptions.Bitbucket.HostSDLC}/projects/{data.Project}/repos/{data.Repository}/browse?at=refs/heads/{_bcpOptions.Bitbucket.ConstructionBranch}",
                    Project = data.Project,
                    Repository = data.Repository
                });
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(errorMessage);

            }
        }
        
        /// <summary>
        /// It returns a list of projects, each project contains a list of repositories, each repository
        /// contains a list of branches (templates)
        /// </summary>
        /// <returns>
        /// A list of ProjectTemplateResponse.
        /// </returns>
        [HttpGet("Templates")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ProjectTemplateResponse>))]
        public IActionResult GetTemplates()
        {
            try
            {
                var repositoriesAndBranches = _bcpOptions.DevSecops.Templates.Select(template =>
                    new ProjectTemplateResponse()
                    {
                        Project = template.Project,
                        Repositories = template.Repositories.Select(repository =>
                            new RepositoryTemplateResponse()
                            {
                                Name = repository,
                                Branches = _bitbucketService.GetBranchesAsync(template.Project, repository, limit: PAGE_LIMIT_BITBUCKTE).Result.Values.Select(branch => branch.DisplayId).ToList()
                            }
                        ).ToList()
                    }).ToList();

                return Ok(repositoriesAndBranches);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(errorMessage);
            }
        }

        /// <summary>
        /// This function creates a repository in Bitbucket, creates the master, develop and
        /// construction branches, and copies the files from the template repository to the new
        /// repository
        /// </summary>
        /// <param name="data">Information of the new repository</param>
        /// <returns>
        /// The response is RepositoryResponse.
        /// </returns>
        [HttpPost("CreateRepositoryByTemplate")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RepositoryResponse))]
        public async Task<IActionResult> GetCreateRepositoryByTemplate(RepositoryTemplateDto data)
        {
            try
            {
                RepositoryResponse? newRepository = null;

                try
                {
                    newRepository = await _bitbucketService.CreateRepositoryAsync(data.Project, data.Repository);
                }
                catch (Exception ex)
                {
                    var errorMessage = ex.GetBaseException().Message;

                    newRepository = await _bitbucketService.GetRepositoryAsync(data.Project, data.Repository, errorMessage);
                }

                var branchesOfRepository = await _bitbucketService.GetBranchesAsync(data.Project, data.Repository);

                if (!branchesOfRepository.Values.Any() || !branchesOfRepository.Values.Where(branch => branch.DisplayId == _bcpOptions.Bitbucket.MasterBranch).Any())
                {
                    var masterBranchCreated = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.MasterBranch, ".gitkeep", string.Empty, verifyLastCommit: false);
                }

                if (!branchesOfRepository.Values.Any() || !branchesOfRepository.Values.Where(branch => branch.DisplayId == _bcpOptions.Bitbucket.DevelopBranch).Any())
                {
                    var developBranchCreated = await _bitbucketService.CreateBranchAsync(data.Project, data.Repository, _bcpOptions.Bitbucket.DevelopBranch);
                }

                if (!branchesOfRepository.Values.Any() || !branchesOfRepository.Values.Where(branch => branch.DisplayId == _bcpOptions.Bitbucket.ConstructionBranch).Any())
                {
                    var constructionBranchCreated = await _bitbucketService.CreateBranchAsync(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, _bcpOptions.Bitbucket.DevelopBranch);
                }

                var filesOfTemplate = await _bitbucketService.GetFileNamesAsync(data.ProjectSource, data.RepositorySource, data.BranchSource, limit: PAGE_LIMIT_BITBUCKTE);

                if (!filesOfTemplate.Values.Any())
                {
                    var notFindFilesTemplate = $"It was impossible to find the files in devsecops template ${data.ProjectSource}/${data.RepositorySource}/${data.BranchSource}";

                    throw new Exception(notFindFilesTemplate);
                }

                foreach (var file in filesOfTemplate.Values)
                {
                    if (file.Contains(".xlsx"))
                    {
                        var contentFile = await _bitbucketService.GetContentByFileAsync<byte[]>(data.ProjectSource, data.RepositorySource, data.BranchSource, file);
                        var fileUpdated = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, file, contentFile, verifyLastCommit: false);
                    }
                    else
                    {
                        var contentFile = await _bitbucketService.GetContentByFileAsync<string>(data.ProjectSource, data.RepositorySource, data.BranchSource, file);
                        var fileUpdated = await updateFile(data.Project, data.Repository, _bcpOptions.Bitbucket.ConstructionBranch, file, contentFile, verifyLastCommit: false);
                    }
                }

                return Ok(newRepository);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(errorMessage);
            }
        }

        /// <summary>
        /// This function updates a file in a repository
        /// </summary>
        /// <param name="project">The project name</param>
        /// <param name="repository">The name of the repository</param>
        /// <param name="branch">The branch you want to update.</param>
        /// <param name="path">The path to the file in the repository.</param>
        /// <param name="content">The content to be updated.</param>
        /// <param name="verifyLastCommit">This is a boolean value that tells the method to check the
        /// last commit of the file before updating it. If the file has been updated since the last time
        /// the method was called, the method will throw an exception.</param>
        /// <returns>
        /// The return value is a string.
        /// </returns>
        private async Task<string> updateFile<T>(string project, string repository, string branch, string path, T content, bool verifyLastCommit = true)
        {
            string? actionFileLastCommit = null;

            if (verifyLastCommit)
            {
                var actionCommits = await _bitbucketService.GetCommitsByPathAsync(project, repository, branch, path);
                actionFileLastCommit = actionCommits != null && actionCommits.Values.Any() ? actionCommits.Values.First().DisplayId : null;
            }

            var updateFileAction = await _bitbucketService.UpdateFileAsync(project, repository, branch, path, content, actionFileLastCommit, $"File {path} was generated from AutoDoc-BCPServer.");

            return updateFileAction.Message;
        }
    }
}
