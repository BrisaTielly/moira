using Moira.Backend;
using Moira.Backend.Services;
using Moira.Backend.Services.Interpretation;
using Moira.Backend.Services.Readings;
using Moira.Backend.Services.Safety;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// ---- Domínio ----
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<IReadingStore, InMemoryReadingStore>();
builder.Services.AddSingleton<IDeckShuffler, CryptoDeckShuffler>();
builder.Services.AddSingleton<IFreeReadingPolicy, InMemoryFreeReadingPolicy>();
builder.Services.AddSingleton<ISafetyScreener, KeywordSafetyScreener>();
builder.Services.AddSingleton<IOutputGuard, RegexOutputGuard>();
builder.Services.AddScoped<IReadingService, ReadingService>();

// ---- Interpretação ----
builder.Services.Configure<LlmOptions>(builder.Configuration.GetSection(LlmOptions.Section));
var llm = builder.Configuration.GetSection(LlmOptions.Section).Get<LlmOptions>() ?? new LlmOptions();

builder.Services.AddSingleton<PromptBuilder>();
builder.Services.AddSingleton<InterpretationCache>();
builder.Services.AddSingleton<TemplateInterpretationModel>();
if (llm.UsesRemoteModel)
{
    // Timeout controlado pelo próprio cliente (LlmOptions.TimeoutSeconds).
    builder.Services.AddHttpClient<IInterpretationModel, OpenAiCompatibleModel>(c => c.Timeout = Timeout.InfiniteTimeSpan);
}
else
{
    builder.Services.AddSingleton<IInterpretationModel>(sp => sp.GetRequiredService<TemplateInterpretationModel>());
}
builder.Services.AddScoped<IInterpretationService, InterpretationService>();

// ---- Proteções ----
builder.Services.AddMoiraRateLimits(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.Logger.LogInformation(
    "Interpretação usando {Provider}.",
    llm.UsesRemoteModel ? $"{llm.BaseUrl} ({llm.Model})" : "modelo de template (sem IA; configure Moira:Llm para usar um provedor)");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseRateLimiter();
app.UseAuthorization();
app.MapControllers();

app.Run();

/// <summary>Exposto para os testes de integração (WebApplicationFactory).</summary>
public partial class Program { }
