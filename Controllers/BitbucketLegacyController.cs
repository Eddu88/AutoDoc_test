using BCPServer.Options;
using BCPServerControllers;
using BCPServerServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using BCPServer.Responses.Bitbucket;
namespace BCPServer.Controllers
{
    /// <summary>
    /// BitbucketLegacy Controller Class
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
    public class BitbucketLegacyController : GenericController
    {
        private readonly BitbucketService _bitbucketService;

        /// <summary>
        /// A constructor
        /// </summary>
        /// <param name="bcpOptions">Object with credentials and server data</param>
        /// <param name="logger">Logger</param>
        public BitbucketLegacyController(IOptions<BCPOptions> bcpOptions, ILogger<GenericController> logger)
            : base(bcpOptions, logger)
        {
            _bitbucketService = new BitbucketService(_bcpOptions.Bitbucket.HostLegacy, _bcpOptions.Bitbucket.TokenLegacy);
        }

        /// <summary>
        /// This function is used to get the last commit id of a specific branch of a specific
        /// repository of a specific project
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="branch">The branch you want to get the last commit from.</param>
        /// <param name="limit">The number of commits to return.</param>
        /// <returns>
        /// The last commit id for the specified branch.
        /// </returns>
        [HttpGet("LastCommit/{project}/{repository}/{branch}/{limit?}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BitbucketResponse<CommitResponse>))]
        public async Task<IActionResult> GetLastCommitIdAsync(string project, string repository, string branch, int limit = 0)
        {
            try
            {
                var request = await _bitbucketService.GetLastCommitAsync(project, repository, branch, limit);

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
        /// It gets the last pull request that was merged into the branch specified by the `atBranch`
        /// parameter
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="atBranch">The branch you want to get the last pull request for.</param>
        /// <returns>
        /// A list of pull requests
        /// </returns>
        [HttpGet("LastPullRequest/{project}/{repository}/{atBranch}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BitbucketResponse<PullRequestResponse>))]
        public async Task<IActionResult> GetLastPullRequest(string project, string repository, string atBranch)
        {
            try
            {
                var request = await _bitbucketService.GetLastPullRequestAsync(project, repository, atBranch, 0, "MERGED");

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
        /// It gets the changes of a pull request
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="pullRequestId">The ID of the pull request</param>
        /// <returns>
        /// The changes of a pull request.
        /// </returns>
        [HttpGet("ChangesOfPullRequest/{project}/{repository}/{pullRequestId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BitbucketResponse<PullRequestChangeResponse>))]
        public async Task<IActionResult> GetChangesOfPullRequest(string project, string repository, string pullRequestId)
        {
            try
            {
                var request = await _bitbucketService.GetPullRequestChangesAsync(project, repository, pullRequestId);

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
        /// It's a GET request that returns a list of branches from a Bitbucket repository
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="filterText">This is the text that the user types in the search box.</param>
        /// <returns>
        /// A list of branches
        /// </returns>
        [HttpGet("Branches/{project}/{repository}/{filterText}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BitbucketResponse<BranchResponse>))]
        public async Task<IActionResult> GetBranches(string project, string repository, string filterText)
        {
            try
            {
                var request = await _bitbucketService.GetBranchesAsync(project, repository, filterText);

                return Ok(request);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(errorMessage);
            }
        }
    }
}