using BCPServer.Options;
using BCPServerControllers;
using BCPServer.Dto;
using BCPServer.Responses.Jenkins;
using BCPServerServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BCPServer.Controllers
{
    /// <summary>
    /// Jenkins Controller Class
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(string))]
    public class JenkinsController : GenericController
    {
        private readonly JenkinsService _jenkinsService;

        /// <summary>
        /// A constructor
        /// </summary>
        /// <param name="bcpOptions">Object with credentials and server data</param>
        /// <param name="logger">Logger</param>
        public JenkinsController(IOptions<BCPOptions> bcpOptions, ILogger<GenericController> logger)
            : base(bcpOptions, logger)
        {
            _jenkinsService = new JenkinsService(_bcpOptions.Jenkins.Host, _bcpOptions.Jira.UserName, _bcpOptions.Jira.Password);
        }

        /// <summary>
        /// It takes a JenkinsJobDto object, and uses the CopyJob function in the JenkinsService class
        /// to copy a job from the Jenkins server
        /// </summary>
        /// <param name="JenkinsJobDto">This is a DTO that contains the information job.</param>
        /// <returns>
        /// The response is object with data of the job created.
        /// </returns>
        [HttpPost("CreateJob")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(JobResponse))]
        public async Task<IActionResult> CreateNewJob(JenkinsJobDto jobData)
        {
            var jobsCreated = new List<JobResponse>();

            try
            {                
                jobsCreated.Add(await generateJob(jobData.LayerFolder, jobData.NewJobName, _bcpOptions.Jenkins.SourceJobDev, "DEV"));                
                jobsCreated.Add(await generateJob(jobData.LayerFolder, jobData.NewJobName, _bcpOptions.Jenkins.SourceJobCert, "CERT"));
                jobsCreated.Add(await generateJob(jobData.LayerFolder, jobData.NewJobName, _bcpOptions.Jenkins.SourceJobProd, "PROD"));
                
                return Ok(jobsCreated);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.GetBaseException().Message;

                _logger.LogError(errorMessage);
                return BadRequest(errorMessage);
            }
        }

        /// <summary>
        /// It takes a source job, copies it to a new job, and then returns the new job's name
        /// </summary>
        /// <param name="layerFolder">The folder where the job will be created.</param>
        /// <param name="newJobName">The name of the new job</param>
        /// <param name="sourceJob">The name of the job that will be copied.</param>
        /// <param name="environment">The environment that the job is being created for.</param>
        /// <returns>
        /// A JobResponse object.
        /// </returns>
        public async Task<JobResponse> generateJob(string layerFolder, string newJobName, string sourceJob, string environment) {
            var jobName = $"{newJobName}_{environment}";
            var productionJob = await _jenkinsService.CopyJob(new JenkinsJobDto {
                EnvironmentFolder = _bcpOptions.Jenkins.EnvironmentFolder,
                SourceLayerFolder = _bcpOptions.Jenkins.SourceLayer,
                SourceJobName = sourceJob,
                NewJobName = jobName,
                LayerFolder = layerFolder
            });
            
            _logger.LogInformation($"Job Jenkins Generated: {jobName}");

            return new JobResponse(_bcpOptions.Jenkins.Host) {
                EnvironmentFolder = _bcpOptions.Jenkins.EnvironmentFolder,
                LayerFolder = layerFolder,
                JobName = jobName
            };
        }
    }
}