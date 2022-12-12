using BCPServer.Dto;
using BCPServer.Options;
using BCPServer.Responses.Jira;
using BCPServer.Services;
using BCPServerServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
namespace BCPServerControllers
{
    /// <summary>
    /// Jira Controller Class
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
    public class JiraController : GenericController
    {
        private JiraService _jiraService;   
        private readonly BitbucketService _bitbucketService;

        /// <summary>
        /// A constructor
        /// </summary>
        /// <param name="bcpOptions">Object with credentials and server data</param>
        /// <param name="logger">Logger</param>
        public JiraController(IOptions<BCPOptions> bcpOptions, ILogger<JiraController> logger)
            : base(bcpOptions, logger)
        {
            _jiraService = new JiraService(_bcpOptions.Jira.Host, _bcpOptions.Jira.UserName, _bcpOptions.Jira.Password);
            _bitbucketService = new BitbucketService(_bcpOptions.Bitbucket.HostSDLC, _bcpOptions.Bitbucket.TokenSDLC);
        }

        
        /// <summary>
        /// This function is used to get the allowed values for a custom field
        /// </summary>
        /// <param name="application">The name of the application that the custom field is associated
        /// with.</param>
        /// <returns>
        /// The response is a list of custom field values.
        /// </returns>
        [HttpGet("AllowedValues/{application}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CustomFieldValueResponse))]
        public async Task<IActionResult> AllowedValues(string application)
        {
            try
            {
                var request = await _jiraService.GetCustomFieldAllowedValuesAsync(_bcpOptions.Jira.TicketSource, application);

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
        /// It creates an issue in Jira, and then creates a pull request in Bitbucket for each
        /// repository that is specified in the issue
        /// </summary>
        /// <param name="issue">This is the object that is sent to the API.</param>
        /// <returns>
        /// The response is a JSON object with the following structure:
        /// ```json
        /// {
        ///   "id": "BCP-1",
        ///   "url": "https://jira.bcp.com.pe/browse/BCP-1"
        /// }
        /// ```
        /// </returns>
        [HttpPost("CreateIssue")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IssueResponse))]
        public async Task<IActionResult> CreateIssue(IssueDto issue)
        {
            try
            {
                var isProcess = issue.ProccessBitbucket != null && !string.IsNullOrEmpty(issue.ProccessBitbucket.Project) && !string.IsNullOrEmpty(issue.ProccessBitbucket.Repository);
                
                issue.Project = IssueOptions.Project;
                issue.Type = isProcess ? IssueOptions.Criticality3 : IssueOptions.Criticality2;
                issue.CommitId = "[Completa esta información cuando el PR este aprobado!]";

                var request = await _jiraService.CreateIssueAsync(issue);

                var responseIssue = new IssueResponse(_bcpOptions.Jira.Host)
                {
                    Id = request.Key.Value
                };

                if (isProcess)
                {
                    _logger.LogInformation($"Creating PR on bitbucket [Process] {issue.ProccessBitbucket.Project}|{issue.ProccessBitbucket.Repository}");
                    await UpdateVersionFileAndCreatePullRequest(issue.ProccessBitbucket.Project, issue.ProccessBitbucket.Repository, issue.GeneratePullRequest, responseIssue);
                }

                if (issue.MetadataBitbucket != null && !string.IsNullOrEmpty(issue.MetadataBitbucket.Project) && !string.IsNullOrEmpty(issue.MetadataBitbucket.Repository))
                {
                    _logger.LogInformation($"Creating PR on bitbucket [Metadata] {issue.MetadataBitbucket.Project}|{issue.MetadataBitbucket.Repository}");
                    await UpdateVersionFileAndCreatePullRequest(issue.MetadataBitbucket.Project, issue.MetadataBitbucket.Repository, issue.GeneratePullRequest, responseIssue);
                }

                if (issue.LinajeBitbucket != null && !string.IsNullOrEmpty(issue.LinajeBitbucket.Project) && !string.IsNullOrEmpty(issue.LinajeBitbucket.Repository))
                {
                    _logger.LogInformation($"Creating PR on bitbucket [Linaje] {issue.LinajeBitbucket.Project}|{issue.LinajeBitbucket.Repository}");
                    await UpdateVersionFileAndCreatePullRequest(issue.LinajeBitbucket.Project, issue.LinajeBitbucket.Repository, issue.GeneratePullRequest, responseIssue);
                }

                return Ok(responseIssue);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(errorMessage);
            }
        }

        /// <summary>
        /// It checks if the Jira user is valid
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
                var userData = await _jiraService.ComprobeUserAsync(_bcpOptions.Jira.UserName);

                _logger.LogInformation($"Verified user {userData.DisplayName}");

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
        /// It gets the last commit of the version file in the construction branch, updates the version
        /// file with the new MVP key and creates a pull request from the construction branch to the
        /// develop branch
        /// </summary>
        /// <param name="project">The project name in Bitbucket</param>
        /// <param name="repository">The name of the repository</param>
        /// <param name="generatePullRequest">true/false</param>
        /// <param name="issue">This is the response from the Jira API when creating an issue.</param>
        private async Task UpdateVersionFileAndCreatePullRequest(string project, string repository, bool generatePullRequest, IssueResponse issue)
        {
            try
            {
                var branchMaker = (string str) => $"refs/heads/{str}";                
                var pullRequestState = "OPEN";
                var pullRequestTitle = $"PR version file update [{_bcpOptions.Bitbucket.ConstructionBranch} -> {_bcpOptions.Bitbucket.DevelopBranch}]";
                var pullRequestDescription = "PullRequest generated by AutoDoc-BCPServer adding MVP key to version file in bitbucket.";
                var messageCommit = "Version file was updated from AutoDoc-BCPServer.";

                var lastChanges = await _bitbucketService.GetCommitsByPathAsync(project, repository, _bcpOptions.Bitbucket.ConstructionBranch, _bcpOptions.Bitbucket.VersionFile);

                var lastCommitId = lastChanges != null && lastChanges.Values.Any() ? lastChanges.Values.First().DisplayId : null;

                var updateVersionFileCommit = await _bitbucketService.UpdateFileAsync(project, repository, _bcpOptions.Bitbucket.ConstructionBranch, _bcpOptions.Bitbucket.VersionFile, issue.Id, lastCommitId, messageCommit);
                
                if(generatePullRequest)
                {
                    var lastPullRequest = await _bitbucketService.GetLastPullRequestAsync(project, repository, _bcpOptions.Bitbucket.DevelopBranch);

                    if (lastPullRequest != null && (lastPullRequest.Size == 0
                        || !lastPullRequest.Values.Where(pr => pr.FromRef.Id == branchMaker(_bcpOptions.Bitbucket.ConstructionBranch) && pr.ToRef.Id == branchMaker(_bcpOptions.Bitbucket.DevelopBranch)).Any()))
                    {
                        var data = new PullRequestDto()
                        {
                            Title = pullRequestTitle,
                            Description = pullRequestDescription,
                            State = pullRequestState,
                            Open = true,
                            FromRef = new BranchReferenceDto()
                            {
                                Id = branchMaker(_bcpOptions.Bitbucket.ConstructionBranch)
                            },
                            ToRef = new BranchReferenceDto()
                            {
                                Id = branchMaker(_bcpOptions.Bitbucket.DevelopBranch)
                            }
                        };

                        var pullRequestCreated = await _bitbucketService.CreatePullRequestAsync(project, repository, data);
                    }
                }                
            }
            catch (Exception ex)
            {
                var errorMessage = $"MVP Jira was created `<a href=\"{issue.Url}\" target=\"_blank\">{issue.Id}</a>` but there was a problem with the PR on Bitbucket: " + ex.GetBaseException().Message;

                _logger.LogError(errorMessage);

                throw new Exception(errorMessage);
            }
        }
    }
}
