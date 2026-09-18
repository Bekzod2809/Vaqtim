using FluentValidation;
using ValidationException = WatchShop.Api.Exceptions.ValidationException;

namespace WatchShop.Api.Validators;

public static class ValidatorExtensions
{
    public static void Tekshir<T>(this IValidator<T> validator, T dto)
    {
        var natija = validator.Validate(dto);

        if (natija.IsValid)
        {
            return;
        }

        var xatolar = natija.Errors
            .GroupBy(x => x.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.ErrorMessage).ToArray());

        throw new ValidationException(xatolar);
    }

    // JSON enumga istalgan sonni (99 yoki yuborilmasa 0) qabul qiladi, shuning uchun alohida tekshiramiz
    public static void EnumTekshir<TEnum>(TEnum qiymat, string maydonNomi) where TEnum : struct, Enum
    {
        if (Enum.IsDefined(qiymat))
        {
            return;
        }

        var ruxsatEtilganlar = string.Join(", ", Enum.GetValues<TEnum>().Select(v => $"{Convert.ToInt32(v)} ({v})"));

        throw new ValidationException(new Dictionary<string, string[]>
        {
            [maydonNomi] = [$"Noto'g'ri qiymat. Ruxsat etilganlar: {ruxsatEtilganlar}."]
        });
    }
}
