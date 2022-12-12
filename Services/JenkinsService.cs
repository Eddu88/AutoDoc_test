using BCPServer.Dto;
using System.Net.Http.Headers;
using System.Text;
using System.Net;
using Polly.Retry;
using Polly;

namespace BCPServerServices
{
    /// <summary>
    /// It´s a class to makes requests to Jenkins API
    /// </summary>
    public class JenkinsService
    {
        private readonly HttpClient _httpClient;
        private readonly string _token;
        private readonly int _retryAttempts;
        private readonly int _retryBackoffExponent;


        /// <summary>
        /// A constructor
        /// </summary>
        /// <param name="host">Jenkins host</param>
        /// <param name="user">User name</param>
        /// <param name="password">Password</param>
        public JenkinsService(string host, string user, string password, int retryAttempt = 2, int retryBackoffExponent = 2)
        {
            _retryAttempts = retryAttempt;
            _retryBackoffExponent = retryBackoffExponent;
            _token = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{user}:{password}"));

            var handler = new HttpClientHandler()
            {
                AllowAutoRedirect = false
            };

            _httpClient = new HttpClient(handler)
            {
                BaseAddress = new Uri(host),
            };
            
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", _token);
        }


        /// <summary>
        /// It's a function that makes a request to the API and returns the response as a string
        /// </summary>
        /// <param name="HttpMethod">The HTTP method to use (GET, POST, PUT, DELETE, etc.)</param>
        /// <param name="uri">The uri of the request</param>
        /// <param name="errorMessage">The error message to display if the request fails.</param>
        /// <param name="bodyContent">The body of the request.</param>
        /// <returns>
        /// The response from the API.
        /// </returns>
        private async Task<string> ClientApiRequest(HttpMethod method, string uri, string errorMessage, HttpContent? bodyContent = null)
        {
            var request = new HttpRequestMessage(method, $"/{uri}");

            request.Content = bodyContent;

            using var response = await FollowRedirect(await GetRetryPolicy().ExecuteAsync(() => _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead)));

            if (!response.IsSuccessStatusCode)
            {
                var responseError = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"{errorMessage}|{response.ReasonPhrase}");
            }

            return await response.Content.ReadAsStringAsync();
        }

        /// <summary>
        /// If the response is a redirect, follow it
        /// </summary>
        /// <param name="HttpResponseMessage">The response from the previous request.</param>
        /// <returns>
        /// The response from the redirect.
        /// </returns>
        private async Task<HttpResponseMessage> FollowRedirect(HttpResponseMessage response)
        {
            if (response.StatusCode != HttpStatusCode.Found)
            {
                return response;
            }

            return await GetRetryPolicy().ExecuteAsync(() => _httpClient.GetAsync(response.Headers.Location!.AbsoluteUri));
        }

        /// <summary>
        /// If the response status code is greater than or equal to 500, then wait and retry the request
        /// </summary>
        /// <returns>
        /// The HttpResponseMessage object.
        /// </returns>
        private RetryPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            return Policy.HandleResult(
                (HttpResponseMessage r) => r.StatusCode >= HttpStatusCode.InternalServerError)
                    .WaitAndRetryAsync(_retryAttempts, 
                        (int retryAttempt) => TimeSpan.FromSeconds(Math.Pow(_retryBackoffExponent, retryAttempt))
            );
        }

        /// <summary>
        /// This function copies a job from one folder to another
        /// </summary>
        /// <param name="JenkinsJobDto">This is a class that contains all the parameters needed to create a new job.</param>
        /// <returns>
        /// The response from the Jenkins API.
        /// </returns>
        public async Task<string> CopyJob(JenkinsJobDto jobData)
        {
            var uri = $"job/{jobData.EnvironmentFolder}/job/{jobData.LayerFolder}/createItem?name={jobData.NewJobName}&mode=copy&from=/{jobData.EnvironmentFolder}/{jobData.SourceLayerFolder}/{jobData.SourceJobName}";
            var errorMessage = $"It was impossible to create new job ${jobData.NewJobName}";

            return await ClientApiRequest(HttpMethod.Post, uri, errorMessage);
        }
    }
}
