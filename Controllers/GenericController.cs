using BCPServer.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;


namespace BCPServerControllers
{
    /// <summary>
    /// Generic Controller Class
    /// </summary>
    public class GenericController: ControllerBase
    {
        protected readonly BCPOptions _bcpOptions;
        protected readonly ILogger<GenericController> _logger;

        /// <summary>
        /// A constructor
        /// </summary>
        /// <param name="bcpOptions">Object with credentials and server data</param>
        /// <param name="logger">Logger</param>
        public GenericController(IOptions<BCPOptions> bcpOptions, ILogger<GenericController> logger)
        {
            _logger = logger;
            _bcpOptions = bcpOptions.Value;
        }
    }
}
