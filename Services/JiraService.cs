using Atlassian.Jira;
using BCPServer.Dto;
using BCPServer.Options;
using BCPServer.Responses.Jira;
using System.Text.Json;

namespace BCPServer.Services
{
    /// <summary>
    /// It´s a class to makes requests to JIRA API
    /// </summary>
    public class JiraService
    {
        private readonly JsonSerializerOptions _jsonSerializerOptions;
        private readonly Jira _jira;

        /// <summary>
        /// A constructor that is initializing the JiraService class.
        /// </summary>
        /// <param name="host">Jira host</param>
        /// <param name="userName">User name</param>
        /// <param name="password">Password</param>
        /// <param name="enableTrace">enable trace</param>
        public JiraService(string host, string userName, string password, bool enableTrace = false)
        {
            _jira = Jira.CreateRestClient(host, userName, password, new JiraRestClientSettings()
            {
                EnableRequestTrace = enableTrace
            });
            _jsonSerializerOptions = new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        /// <summary>
        /// It gets the allowed values of a custom field, and returns a list of strings
        /// </summary>
        /// <param name="customFields">This is the custom fields that are available for the issue
        /// type.</param>
        /// <param name="key">The name of the custom field</param>
        /// <param name="application">The application name</param>
        /// <returns>
        /// A list of strings
        /// </returns>
        private List<string> GetAllowedValues(IDictionary<string, IssueFieldEditMetadata> customFields, string key, string? application = null)
        {
            var allowedValuesJson = customFields[key].AllowedValues.ToString();

            var allowedValues = JsonSerializer.Deserialize<List<CustomFieldResponse>>(allowedValuesJson, _jsonSerializerOptions);

            if (allowedValues == null) throw new Exception($"The MVP {key} has no fields has no retrievable fields {key}, make sure it is in the state: 'Registro de solicitud'");

            if (!String.IsNullOrEmpty(application))
                return allowedValues.Where(e => e.Value == application).First().Children.Select(c => c.Value).ToList();
            
            return allowedValues.Select(c => c.Value).ToList();
        }

        /// <summary>
        /// It gets the allowed values for a custom field in a Jira ticket
        /// </summary>
        /// <param name="key">The key of the issue</param>
        /// <param name="application">The application name, this is used to filter the allowed values
        /// for the custom fields.</param>
        /// <returns>
        /// A CustomFieldValueResponse object with the following properties:
        /// Group
        /// Security
        /// GroupAgileOps
        /// Gobernance
        /// ProductOwner
        /// TechnicalLead
        /// QualityAssurance
        /// </returns>
        public async Task<CustomFieldValueResponse> GetCustomFieldAllowedValuesAsync(string key, string application = "LKDV")
        {
            var ticket = _jira.Issues.GetIssueAsync(key).Result;

            var customFields = await ticket.GetIssueFieldsEditMetadataAsync();

            if (customFields == null || (!customFields.Keys.Contains(IssueOptions.Security) || !customFields.Keys.Contains(IssueOptions.GroupAgileOps) ||
                !customFields.Keys.Contains(IssueOptions.Gobernance) || !customFields.Keys.Contains(IssueOptions.ProductOwner) ||
                !customFields.Keys.Contains(IssueOptions.TechnicalLead) || !customFields.Keys.Contains(IssueOptions.QualityAssurance) ||
                !customFields.Keys.Contains(IssueOptions.SourceMVP) || !customFields.Keys.Contains(IssueOptions.TypeRequirement)))
                throw new Exception($"The MVP {key} has no fields has no retrievable fields, make sure it is in the state: 'Registro de solicitud'");

            return new CustomFieldValueResponse() { 
                Group = application,
                Security = GetAllowedValues(customFields, IssueOptions.Security, application),
                GroupAgileOps = GetAllowedValues(customFields, IssueOptions.GroupAgileOps, application),
                Gobernance = GetAllowedValues(customFields, IssueOptions.Gobernance, application),
                ProductOwner = GetAllowedValues(customFields, IssueOptions.ProductOwner, application),
                TechnicalLead = GetAllowedValues(customFields, IssueOptions.TechnicalLead, application),
                QualityAssurance = GetAllowedValues(customFields, IssueOptions.QualityAssurance, application),
                //This filter because None no is valid value in JIRA
                SourceMVP = GetAllowedValues(customFields, IssueOptions.SourceMVP).Where(x => x !=IssueOptions.NoneValue).ToList(),
                TypeRequirement = GetAllowedValues(customFields, IssueOptions.TypeRequirement).Where(x => x !=IssueOptions.NoneValue).ToList()
            };
        }

        /// <summary>
        /// It´s create an issue in Jira
        /// </summary>
        /// <param name="dataIssue">data of the ticket</param>
        /// <returns>
        /// The result is a Issue.
        /// </returns>
        public async Task<Issue> CreateIssueAsync(IssueDto dataIssue)
        {
            var ticket = _jira.CreateIssue(IssueOptions.Project);

            ticket.Type = dataIssue.Type;
            ticket.Summary = dataIssue.Summary;
            ticket.Description = dataIssue.Description;
            ticket.CustomFields.AddCascadingSelectField(IssueOptions.Security, dataIssue.Group, dataIssue.Security);
            ticket.CustomFields.AddCascadingSelectField(IssueOptions.GroupAgileOps, dataIssue.Group, dataIssue.GroupAgileOps);
            ticket.CustomFields.AddCascadingSelectField(IssueOptions.Gobernance, dataIssue.Group, dataIssue.Gobernance);
            ticket.CustomFields.AddCascadingSelectField(IssueOptions.ProductOwner, dataIssue.Group, dataIssue.ProductOwner);
            ticket.CustomFields.AddCascadingSelectField(IssueOptions.TechnicalLead, dataIssue.Group, dataIssue.TechnicalLead);
            ticket.CustomFields.AddCascadingSelectField(IssueOptions.QualityAssurance, dataIssue.Group, dataIssue.QualityAssurance);
            ticket.CustomFields.Add(IssueOptions.SourceMVP, dataIssue.SourceMVP);
            ticket.CustomFields.Add(IssueOptions.TypeRequirement, dataIssue.TypeRequirement);
            ticket[IssueOptions.NumberTicket] = dataIssue.NumberTicket;
            ticket[IssueOptions.CertificationInstruction] = dataIssue.CertificationInstruction;
            ticket[IssueOptions.ProductionInstruction] = dataIssue.ProductionInstruction;
            ticket[IssueOptions.ReversionInstruction] = dataIssue.ReversionInstruction;
            ticket[IssueOptions.CommitId] = dataIssue.CommitId;

            var result = await ticket.SaveChangesAsync();

            return result;
        }

        /// <summary>
        /// It's search a user in Jira
        /// </summary>
        /// <param name="userSlug">The username of the user you want to retrieve.</param>
        /// <returns>
        /// A JiraUser
        /// </returns>
        public async Task<JiraUser> ComprobeUserAsync(string userSlug)
        {
            var user = await _jira.Users.GetUserAsync(userSlug);

            return user;
        }
    }
}
