namespace BCPServer.Responses.Bitbucket
{
    public class BitbucketResponse<Value>
    {
        public List<Value> Values { get; set; }
        public int Size { get; set; }
        public bool IsLastPage { get; set; }
        public int Start { get; set; }
        public int Limit { get; set; }
        public object NextPageStart { get; set; }
    }
}