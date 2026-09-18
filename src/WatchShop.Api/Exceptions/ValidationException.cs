namespace WatchShop.Api.Exceptions;

public class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("Kiritilgan ma'lumotlarda xatolik bor.")
    {
        Errors = errors;
    }
}
