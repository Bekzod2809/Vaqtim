using FluentValidation;
using ValidationException = WatchShop.Api.Exceptions.ValidationException;

namespace WatchShop.Api.Validators;

public static class ValidatorExtensions
{
    public static void Validate<T>(this IValidator<T> validator, T dto)
    {
        var result = validator.Validate(dto);

        if (result.IsValid)
        {
            return;
        }

        var errors = result.Errors
            .GroupBy(x => x.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.ErrorMessage).ToArray());

        throw new ValidationException(errors);
    }

    // JSON enumga istalgan sonni (99 yoki yuborilmasa 0) qabul qiladi, shuning uchun alohida tekshiramiz
    public static void ValidateEnum<TEnum>(TEnum value, string fieldName) where TEnum : struct, Enum
    {
        if (Enum.IsDefined(value))
        {
            return;
        }

        var ruxsatEtilganlar = string.Join(", ", Enum.GetValues<TEnum>().Select(v => $"{Convert.ToInt32(v)} ({v})"));

        throw new ValidationException(new Dictionary<string, string[]>
        {
            [fieldName] = [$"Noto'g'ri qiymat. Ruxsat etilganlar: {ruxsatEtilganlar}."]
        });
    }
}
