using EnterpriseAI.API.Services;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -- SEMANTIC KERNEL SETUP --
// For the showcase, we allow switching between Real and Mock providers via configuration.
// By default (and for the interview demo), it falls back to Mock if no OpenAiKey is found.
var openAiKey = builder.Configuration["AzureOpenAI:Key"];
var openAiEndpoint = builder.Configuration["AzureOpenAI:Endpoint"];
var openAiModel = builder.Configuration["AzureOpenAI:DeploymentName"];

var kernelBuilder = builder.Services.AddKernel();

// DI Logic: Use Real Azure OpenAI if configured, otherwise Mock
if (!string.IsNullOrEmpty(openAiKey) && !string.IsNullOrEmpty(openAiEndpoint))
{
    // Real implementation
    kernelBuilder.AddAzureOpenAIChatCompletion(
        deploymentName: openAiModel!,
        endpoint: openAiEndpoint!,
        apiKey: openAiKey!
    );
}
else
{
    // Mock implementation for "Showcase" / "Interview" loop
    // Note: We register MockChatCompletionService as IChatCompletionService
    builder.Services.AddSingleton<IChatCompletionService, MockChatCompletionService>();
}

// Register our application services
// Pass the Kernel (which now has the chat service) to CopilotService
builder.Services.AddScoped<ISearchService, MockSearchService>();
builder.Services.AddScoped<CopilotService>();

// -- CORS Setup for React Frontend --
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", 
                "http://localhost:3000",
                "http://localhost:5222",
                "http://localhost:8080",
                "http://frontend:8080"  // Allow docker-compose frontend service
            )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Health check endpoint for container orchestration
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
   .WithName("HealthCheck")
   .WithOpenApi();

app.Run();
