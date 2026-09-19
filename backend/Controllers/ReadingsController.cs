using Microsoft.AspNetCore.Mvc;
using Moira.Backend.Models;
using Moira.Backend.Services;

namespace Moira.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReadingsController : ControllerBase
{
    private readonly IReadingService _readingService;

    public ReadingsController(IReadingService readingService)
    {
        _readingService = readingService;
    }

    [HttpPost("question")]
    [ProducesResponseType(typeof(StartReadingResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitQuestion([FromBody] StartReadingRequestDto request)
    {
        try
        {
            var result = await _readingService.StartReadingAsync(request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
