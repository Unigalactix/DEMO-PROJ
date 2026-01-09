using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Runtime.CompilerServices;

namespace EnterpriseAI.API.Services
{
    public class CopilotService
    {
        private readonly IChatCompletionService _chat;
        private readonly Kernel _kernel;
        private readonly ISearchService _searchService;

        public CopilotService(Kernel kernel, IChatCompletionService chat, ISearchService searchService)
        {
            _kernel = kernel;
            _chat = chat;
            _searchService = searchService;
        }

        public async IAsyncEnumerable<string> ChatStreamAsync(string userMessage, [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            var history = new ChatHistory();
            
            // In a real scenario, we would retrieve system prompt from configuration or a "Persona" store
            history.AddSystemMessage("You are an expert Legal Copilot designed to assist with contract review. Be precise, cite sources, and maintain a professional tone.");
            
            // RAG Step
            var relevantContext = await _searchService.SearchAsync(userMessage);
            if (!string.IsNullOrWhiteSpace(relevantContext))
            {
                history.AddSystemMessage($"Additional Context from Company Documents:\n{relevantContext}");
            }

            history.AddUserMessage(userMessage);

            await foreach (var update in _chat.GetStreamingChatMessageContentsAsync(history, null, _kernel, cancellationToken))
            {
                if (!string.IsNullOrEmpty(update.Content))
                {
                    yield return update.Content;
                }
            }
        }
    }
}
