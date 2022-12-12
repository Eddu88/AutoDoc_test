using BCPServer.Responses.Errors;

namespace BCPServerResponses.Errors
{
    public class ErrorResponse
    {
        public List<ErrorContentResponse> Errors { get; set; }

        public string? GetFirstMessage()
        {
            try
            {
                return Errors.First().Message;
            }
            catch(Exception)
            {
                return string.Empty;
            }
        }
    }
}
