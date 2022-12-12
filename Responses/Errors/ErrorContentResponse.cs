namespace BCPServer.Responses.Errors
{
    public class ErrorContentResponse
    {
        public string Message { get; set; }
        public string Context { get; set; }
        public string ExceptionName { get; set; }
    }
}