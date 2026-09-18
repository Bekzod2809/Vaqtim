using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Exceptions;

namespace WatchShop.Api.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate Next;
    private readonly ILogger<ExceptionMiddleware> Logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        Next = next;
        Logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await Next(context);
        }
        catch (NotFoundException ex)
        {
            Logger.LogWarning(ex, "Topilmadi");
            await WriteResponse(context, 404, ex.Message);
        }
        catch (ValidationException ex)
        {
            Logger.LogWarning(ex, "Validatsiya xatosi");
            await WriteResponse(context, 422, ex.Message, ex.Errors);
        }
        catch (BadRequestException ex)
        {
            Logger.LogWarning(ex, "Noto'g'ri so'rov");
            await WriteResponse(context, 400, ex.Message);
        }
        catch (UnauthorizedException ex)
        {
            Logger.LogWarning(ex, "Ruxsat yo'q");
            await WriteResponse(context, 401, ex.Message);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            // Masalan, ikki xaridor oxirgi mahsulotni bir vaqtda sotib olmoqchi bo'lsa
            Logger.LogWarning(ex, "Bir vaqtda o'zgartirish");
            await WriteResponse(context, 409, "Mahsulot qoldig'i hozirgina o'zgardi. Savatni tekshirib, qayta urinib ko'ring.");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Server xatosi");
            await WriteResponse(context, 500, "Server xatosi", ex.Message);
        }
    }

    private static async Task WriteResponse(HttpContext context, int statusCode, string message, object? detail = null)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            StatusCode = statusCode,
            Message = message,
            Detail = detail,
            TraceId = context.TraceIdentifier,
            Timestamp = DateTime.UtcNow
        });
    }
}
