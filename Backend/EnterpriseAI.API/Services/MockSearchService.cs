namespace EnterpriseAI.API.Services
{
    public class MockSearchService : ISearchService
    {
        public Task<string> SearchAsync(string query)
        {
            // Simulate vector search latency
            // await Task.Delay(300); 

            if (query.Contains("termination", StringComparison.OrdinalIgnoreCase))
            {
                return Task.FromResult("Termination Clause: This Agreement may be terminated by either party upon thirty (30) days prior written notice. [Source: Master Service Agreement, p.4]");
            }
            
            if (query.Contains("liability", StringComparison.OrdinalIgnoreCase))
            {
                return Task.FromResult("Limitation of Liability: The total liability of either party shall not exceed the total fees paid under this Agreement in the twelve (12) months preceding the claim. [Source: Master Service Agreement, p.7]");
            }

            if (query.Contains("payment", StringComparison.OrdinalIgnoreCase))
            {
                return Task.FromResult("Payment Terms: Invoices are due and payable within thirty (30) days of the invoice date. Late payments shall accrue interest at 1.5% per month. [Source: Master Service Agreement, p.2]");
            }

            return Task.FromResult(string.Empty);
        }
    }
}
