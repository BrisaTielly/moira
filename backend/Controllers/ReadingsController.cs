using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Moira.Backend.Models;
using Moira.Backend.Services;
using Moira.Backend.Services.Interpretation;

namespace Moira.Backend.Controllers;

/// <summary>Controller fino: valida o transporte e traduz erros de domínio para HTTP.</summary>
[ApiController]
[Route("api/[controller]")]
public class ReadingsController(IReadingService readingService, IInterpretationService interpretationService)
    : ControllerBase
{
    [HttpPost("question")]
    [EnableRateLimiting(RateLimitPolicies.Readings)]
    [ProducesResponseType(typeof(StartReadingResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorDto), StatusCodes.Status402PaymentRequired)]
    public Task<IActionResult> SubmitQuestion([FromBody] StartReadingRequestDto request) =>
        Handle(async () => Ok(await readingService.StartReadingAsync(request)));

    [HttpPost("{readingId}/draw")]
    [EnableRateLimiting(RateLimitPolicies.Readings)]
    [ProducesResponseType(typeof(DrawResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorDto), StatusCodes.Status404NotFound)]
    public Task<IActionResult> Draw(string readingId, [FromBody] DrawRequestDto request) =>
        Handle(() => Task.FromResult<IActionResult>(Ok(readingService.Draw(readingId, request))));

    [HttpPost("{readingId}/interpretation")]
    [EnableRateLimiting(RateLimitPolicies.Interpretation)]
    [ProducesResponseType(typeof(InterpretationResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorDto), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiErrorDto), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiErrorDto), StatusCodes.Status503ServiceUnavailable)]
    public Task<IActionResult> GetInterpretation(string readingId, [FromBody] InterpretationRequestDto request, CancellationToken cancellationToken) =>
        Handle(async () => Ok(await interpretationService.GetInterpretationAsync(readingId, request, cancellationToken)));

    private async Task<IActionResult> Handle(Func<Task<IActionResult>> action)
    {
        try
        {
            return await action();
        }
        catch (MoiraException ex)
        {
            return StatusCode(ex.Status, new ApiErrorDto(ex.Code, ex.Message, ex.Retryable));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiErrorDto("invalid_request", ex.Message, false));
        }
    }
}
