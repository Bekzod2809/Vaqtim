using System.Text.RegularExpressions;
using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class PaymentSettingDtoValidator : AbstractValidator<PaymentSettingDto>
{
    public PaymentSettingDtoValidator()
    {
        RuleFor(x => x.CardNumber)
            .NotEmpty().WithMessage("Karta raqami kiritilishi kerak.")
            .Must(BeValidCardNumber).WithMessage("Karta raqami 16 ta raqamdan iborat bo'lishi kerak.");

        RuleFor(x => x.CardHolder)
            .MaximumLength(100).WithMessage("Karta egasi ismi 100 belgidan oshmasligi kerak.");
    }

    private static bool BeValidCardNumber(string? value)
    {
        var digits = Regex.Replace(value ?? string.Empty, @"\D", string.Empty);
        return digits.Length == 16;
    }
}
