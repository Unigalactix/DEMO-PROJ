using EnterpriseAI.API.Models;
using EnterpriseAI.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriseAI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly CopilotService _copilotService;

        public ChatController(CopilotService copilotService)
        {
            _copilotService = copilotService;
        }

        [HttpPost]
        public async IAsyncEnumerable<string> Post([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                yield return "Please provide a valid message.";
                yield break;
            }

            // Stream the response directly to the client
            await foreach (var content in _copilotService.ChatStreamAsync(request.Message, HttpContext.RequestAborted))
            {
                yield return content;
            }
        }
    }
}
