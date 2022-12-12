using BCPServer.Dto;
using BCPServer.Responses.Bitbucket;
using BCPServerResponses.Errors;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace BCPServerServices
{
    /// <summary>
    /// It´s a class to makes requests to Bitbucket API
    /// </summary>
    public class BitbucketService
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _jsonSerializerOptions;
        private readonly string _token;

        /// <summary>
        /// A constructor
        /// </summary>
        /// <param name="host">Bitbucket host</param>
        /// <param name="token">Access token to authenticate</param>
        public BitbucketService(string host, string token)
        {
            _token = token; 

            _httpClient = new HttpClient()
            {
                BaseAddress = new Uri(host)
            };

            _jsonSerializerOptions = new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        /// <summary>
        /// It's a generic function that makes a request to the Bitbucket API and returns the response
        /// as a generic type
        /// </summary>
        /// <param name="method">GET, POST, PUT, DELETE</param>
        /// <param
        /// name="uri">/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments</param>
        /// <param name="errorMessage">"Error message"</param>
        /// <param name="formContent"></param>
        /// <param name="bodyContent"></param>
        /// <returns>
        /// The response from the API is being returned.
        /// </returns>
        private async Task<T> ClientApiRequest<T>(HttpMethod method, string uri, string errorMessage, MultipartFormDataContent? formContent = null, HttpContent? bodyContent = null)
        {
            var request = new HttpRequestMessage(method, $"/rest/api/1.0{uri}");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _token);
            request.Content = formContent ?? bodyContent;

            using var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            if (!response.IsSuccessStatusCode)
            {
                var responseError = await response.Content.ReadAsStreamAsync();
                var errorData = await JsonSerializer.DeserializeAsync<ErrorResponse>(responseError, _jsonSerializerOptions);

                throw new HttpRequestException($"{errorMessage}|{errorData.GetFirstMessage()}");
            }


            if (typeof(T) == typeof(string))
            {
                return (T)Convert.ChangeType(await response.Content.ReadAsStringAsync(), typeof(T));
            }

            if (typeof(T) == typeof(byte[]))
            {
                return (T)Convert.ChangeType(await response.Content.ReadAsByteArrayAsync(), typeof(T));
            }

            await using var responseContentStream = await response.Content.ReadAsStreamAsync();

            return await JsonSerializer.DeserializeAsync<T>(responseContentStream, _jsonSerializerOptions) ?? throw new Exception("It was impossible deserialize the response from bitbucket.");
        }

        /// <summary>
        /// It returns the last commit in a given branch of a given repository in a given project
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="branch">The branch you want to get the last commit from</param>
        /// <param name="limit">The number of commits to return.</param>
        /// <returns>
        /// A BitbucketResponse of CommitResponse
        /// </returns>
        public async Task<BitbucketResponse<CommitResponse>> GetLastCommitAsync(string project, string repository, string branch, int limit = 0)
        {
            var uri = $"/projects/{project}/repos/{repository}/commits?until={branch}&limit={limit}";
            var errorMessage = $"It was impossible to find the last pull request in ${project}/${repository}/${branch}";

            return await ClientApiRequest<BitbucketResponse<CommitResponse>>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// It returns the last pull request in a given repository, at a given branch, with a given
        /// state
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">The name of the repository</param>
        /// <param name="atBranch">The branch you want to find the last pull request for.</param>
        /// <param name="limit">The number of pull requests to return.</param>
        /// <param name="state">The state of the pull request. Can be OPEN, MERGED, or DECLINED.</param>
        /// <returns>
        /// A BitbucketResponse of PullRequestResponse
        /// </returns>
        public async Task<BitbucketResponse<PullRequestResponse>> GetLastPullRequestAsync(string project, string repository, string atBranch, int limit = 0, string state = "OPEN")
        {
            var uri = $"/projects/{project}/repos/{repository}/pull-requests?at=refs/heads/{atBranch}&limit={limit}&state={state}";
            var errorMessage = $"It was impossible to find the last pull request in ${project}/${repository}/${atBranch}";

            return await ClientApiRequest<BitbucketResponse<PullRequestResponse>>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// It's a function that makes a GET request to the Bitbucket API, and returns the response as a
        /// LastChangedReponse object
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">The name of the repository</param>
        /// <param name="branch">The branch you want to get the last changes from.</param>
        /// <param name="limit">The number of commits to return.</param>
        /// <returns>
        /// A list of files that have been changed in the last commit.
        /// </returns>
        public async Task<LastChangedReponse> GetLastChangesAsync(string project, string repository, string branch, int limit = 0)
        {
            var uri = $"/projects/{project}/repos/{repository}/last-modified?at=refs/heads/{branch}&limit={limit}";
            var errorMessage = $"It was impossible to find the last changes in ${project}/${repository}/${branch}";

            return await ClientApiRequest<LastChangedReponse>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// It returns the latest commit of a file in a repository
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="branch">The branch you want to get the commits from</param>
        /// <param name="path">the path to the file you want to get the commits for</param>
        /// <param name="limit">The number of commits to return.</param>
        /// <returns>
        /// A BitbucketResponse of LatestCommit
        /// </returns>
        public async Task<BitbucketResponse<LatestCommit>> GetCommitsByPathAsync(string project, string repository, string branch, string path, int limit = 0)
        {
            var uri = $"/projects/{project}/repos/{repository}/commits?path={path}&until=refs/heads/{branch}&limit={limit}";
            var errorMessage = $"It was impossible to find the commits in ${project}/${repository}/${branch} of {path}";

            return await ClientApiRequest<BitbucketResponse<LatestCommit>>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// It updates a file in a repository
        /// </summary>
        /// <param name="project">The project name</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="branch">the branch you want to update</param>
        /// <param name="fileName">the name of the file to be updated</param>
        /// <param name="fileContent">The type of the file content.</param>
        /// <param name="commitId">The commit ID of the file you want to update.</param>
        /// <param name="messageCommit">The commit message</param>
        /// <returns>
        /// The response is a CommitResponse object.
        /// </returns>
        public async Task<CommitResponse> UpdateFileAsync<T>(string project, string repository, string branch, string fileName, T fileContent, string? commitId, string messageCommit)
        {
            var uri = $"/projects/{project}/repos/{repository}/browse/{fileName}?at=refs/heads/{branch}";
            var errorMessage = $"It was impossible to update the file {fileName} in ${project}/${repository}/${branch}";

            var multipartContent = new MultipartFormDataContent();
            var content = typeof(T) == typeof(byte[]) ? new ByteArrayContent((byte[])(object)fileContent) : new StringContent((string)(object)fileContent);

            multipartContent.Add(content, "content");
            multipartContent.Add(new StringContent(messageCommit), "message");
            multipartContent.Add(new StringContent(branch), "branch");

            if (!string.IsNullOrEmpty(commitId)) multipartContent.Add(new StringContent(commitId), "sourceCommitId");

            return await ClientApiRequest<CommitResponse>(HttpMethod.Put, uri, errorMessage, multipartContent);
        }

        /// <summary>
        /// It creates a pull request in the specified project and repository from the specified fromRef
        /// to the specified toRef
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="pullRequestDto">pull request data</param>
        /// <returns>
        /// PullRequestResponse
        /// </returns>
        public async Task<PullRequestResponse> CreatePullRequestAsync(string project, string repository, PullRequestDto pullRequestDto)
        {
            var uri = $"/projects/{project}/repos/{repository}/pull-requests";
            var errorMessage = $"It was impossible to create pullrequest in ${project}/${repository} from {pullRequestDto.FromRef.Id} to {pullRequestDto.ToRef.Id}";
            var body = new StringContent(JsonSerializer.Serialize(pullRequestDto, _jsonSerializerOptions), Encoding.UTF8, "application/json");

            return await ClientApiRequest<PullRequestResponse>(HttpMethod.Post, uri, errorMessage, bodyContent: body);
        }

        /// <summary>
        /// It makes a GET request to the API endpoint `/users/{userSlug}` and returns the response as a
        /// string
        /// </summary>
        /// <param name="userSlug">The slug of the user you want to find.</param>
        /// <returns>
        /// A string
        /// </returns>
        public async Task<string> ComprobeUserAsync(string userSlug)
        {
            var uri = $"/users/{userSlug}";
            var errorMessage = $"It was impossible to find the user with slug: {userSlug}";
            
            return await ClientApiRequest<string>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// This function will return a list of changes made in a pull request
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="pullRequestId">The ID of the pull request</param>
        /// <returns>
        /// A BitbucketResponse of PullRequestChangeResponse
        /// </returns>
        public async Task<BitbucketResponse<PullRequestChangeResponse>> GetPullRequestChangesAsync(string project, string repository, string pullRequestId)
        {
            var uri = $"/projects/{project}/repos/{repository}/pull-requests/{pullRequestId}/changes";
            var errorMessage = $"It was impossible to find changes on pull request in ${project}/${repository}/${pullRequestId}";

            return await ClientApiRequest<BitbucketResponse<PullRequestChangeResponse>>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// > This function will return a list of branches from a repository in a project
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">The name of the repository</param>
        /// <param name="filterText">The text to filter the branches by.</param>
        /// <param name="limit">The number of results to return per page. The default is 25, and the
        /// maximum allowed value is 100.</param>
        /// <returns>
        /// A BitbucketResponse of BranchResponse
        /// </returns>
        public async Task<BitbucketResponse<BranchResponse>> GetBranchesAsync(string project, string repository, string filterText = "", int limit = 25)
        {
            var uri = $"/projects/{project}/repos/{repository}/branches?filterText={filterText}&limit={limit}";
            var errorMessage = $"It was impossible to find branches in ${project}/${repository} filter text ${filterText}";

            return await ClientApiRequest<BitbucketResponse<BranchResponse>>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// It returns a list of files in a given repository, branch, and path
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="branch">The branch you want to get the files from</param>
        /// <param name="path">The path to the file or folder you want to get the contents of.</param>
        /// <param name="limit">The number of files to return.</param>
        /// <returns>
        /// A BitbucketResponse of strings
        /// </returns>
        public async Task<BitbucketResponse<string>> GetFileNamesAsync(string project, string repository, string branch, string path = "", int limit = 25)
        {
            var uri = $"/projects/{project}/repos/{repository}/files/{path}?at=refs/heads/{branch}&limit={limit}";
            var errorMessage = $"It was impossible to find the files in ${project}/${repository}/${branch}";

            return await ClientApiRequest<BitbucketResponse<string>>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// It gets the content of a file in a repository in a project in a branch
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">the name of the repository</param>
        /// <param name="branch">The name of the branch</param>
        /// <param name="filePath">The path to the file in the repository.</param>
        /// <returns>
        /// The content of the file.
        /// </returns>
        public async Task<T> GetContentByFileAsync<T>(string project, string repository, string branch, string filePath)
        {
            var uri = $"/projects/{project}/repos/{repository}/raw/{filePath}?at=refs/heads/{branch}";
            var errorMessage = $"It was impossible to get the content of {filePath} in ${project}/${repository}/${branch}";

            return await ClientApiRequest<T>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// > Create a new repository in a project
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">The name of the repository to create</param>
        /// <param name="scmId">The type of repository.</param>
        /// <returns>
        /// RepositoryResponse
        /// </returns>
        public async Task<RepositoryResponse> CreateRepositoryAsync(string project, string repository, string scmId = "git")
        {
            var uri = $"/projects/{project}/repos";
            var errorMessage = $"It was impossible to create repository {repository} in ${project}";
            var data = new
            {
                name = repository,
                scmId,
            };
            var body = new StringContent(JsonSerializer.Serialize(data, _jsonSerializerOptions), Encoding.UTF8, "application/json");

            return await ClientApiRequest<RepositoryResponse>(HttpMethod.Post, uri, errorMessage, bodyContent: body);
        }

        /// <summary>
        /// > This function will return a repository in a project
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">The name of the repository</param>
        /// <param name="errorPrevious">This is the error message that will be displayed if the request
        /// fails.</param>
        /// <returns>
        /// A RepositoryResponse
        /// </returns>
        public async Task<RepositoryResponse> GetRepositoryAsync(string project, string repository, string errorPrevious = "")
        {
            var uri = $"/projects/{project}/repos/{repository}";
            var errorMessage = $"{errorPrevious}\nIt was impossible to find repository {repository} in ${project}";

            return await ClientApiRequest<RepositoryResponse>(HttpMethod.Get, uri, errorMessage);
        }

        /// <summary>
        /// > This function creates a new branch in a repository
        /// </summary>
        /// <param name="project">The name of the project</param>
        /// <param name="repository">The name of the repository</param>
        /// <param name="branchName">The name of the branch to create</param>
        /// <param name="branchOrCommitSource">The branch or commit to start the new branch
        /// from.</param>
        /// <returns>
        /// BranchResponse
        /// </returns>
        public async Task<BranchResponse> CreateBranchAsync(string project, string repository, string branchName, string branchOrCommitSource = "master")
        {
            var uri = $"/projects/{project}/repos/{repository}/branches";
            var errorMessage = $"It was impossible to create branch {branchName} in ${project}/{repository}";

            var data = new
            {
                name = branchName,
                startPoint = branchOrCommitSource,
                message = $"Branch {branchName} generated by AUTODOC"
            };
            var body = new StringContent(JsonSerializer.Serialize(data, _jsonSerializerOptions), Encoding.UTF8, "application/json");

            return await ClientApiRequest<BranchResponse>(HttpMethod.Post, uri, errorMessage, bodyContent: body);
        }
    }
}
