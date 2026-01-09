using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Runtime.CompilerServices;

namespace EnterpriseAI.API.Services
{
    /// <summary>
    /// A mock implementation of IChatCompletionService for demonstration purposes without API keys.
    /// Acts as a fallback "Simulator".
    /// </summary>
    public class MockChatCompletionService : IChatCompletionService
    {
        public IReadOnlyDictionary<string, object?> Attributes => new Dictionary<string, object?>();

        public async Task<IReadOnlyList<ChatMessageContent>> GetChatMessageContentsAsync(ChatHistory chatHistory, PromptExecutionSettings? executionSettings = null, Kernel? kernel = null, CancellationToken cancellationToken = default)
        {
            var lastUserMessage = chatHistory.LastOrDefault(m => m.Role == AuthorRole.User)?.Content ?? "";
            var response = GenerateMockResponse(lastUserMessage);
            return new List<ChatMessageContent> { new ChatMessageContent(AuthorRole.Assistant, response) };
        }

        public async IAsyncEnumerable<StreamingChatMessageContent> GetStreamingChatMessageContentsAsync(
            ChatHistory chatHistory, 
            PromptExecutionSettings? executionSettings = null, 
            Kernel? kernel = null, 
            [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            var lastUserMessage = chatHistory.LastOrDefault(m => m.Role == AuthorRole.User)?.Content ?? "";
            var response = GenerateMockResponse(lastUserMessage);

            // Simulate token-by-token streaming
            var tokens = response.Split(' ');
            foreach (var token in tokens)
            {
                await Task.Delay(50, cancellationToken); // Simulate latency
                yield return new StreamingChatMessageContent(AuthorRole.Assistant, token + " ");
            }
        }

        private string GenerateMockResponse(string userMessage)
        {
            if (userMessage.Contains("termination", StringComparison.OrdinalIgnoreCase))
            {
                return "Based on the uploaded contract, the **Termination Clause** states that either party may terminate the agreement with **30 days written notice**. \n\n> \"Termination for Convenience: This Agreement may be terminated by either party upon thirty (30) days prior written notice.\" [Page 4, Section 12.1]";
            }
            if (userMessage.Contains("hello", StringComparison.OrdinalIgnoreCase))
            {
                return "Hello! I am your **SafeContract** Legal Copilot. How can I assist you with your document review today?";
            }
            
            return "I am simulating a sophisticated AI response. Since this is a demo environment without active Azure OpenAI keys, I am providing a placeholder response. In a production environment, I would use RAG to query your Vector Store.";
        }
    }
}
