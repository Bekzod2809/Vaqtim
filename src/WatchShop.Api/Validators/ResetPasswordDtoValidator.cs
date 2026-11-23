using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
{
    public ResetPasswordDtoValidator()
    {
        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Telefon raqami kiritilishi kerak.")
            .Matches(@"^\+998\d{9}$").WithMessage("Telefon raqami +998901234567 formatida bo'lishi kerak.");

        RuleFor(x => x.VerificationCode)
            .NotEmpty().WithMessage("Telegram botdan olingan kodni kiriting.")
            .Matches(@"^\d{6}$").WithMessage("Telegram botdan olingan 6 xonali kodni kiriting.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Yangi parol bo'sh bo'lmasligi kerak.")
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Yangi parol bo'sh bo'lmasligi kerak.")
            .MinimumLength(6).WithMessage("Yangi parol kamida 6 belgidan iborat bo'lishi kerak.")
            .MaximumLength(100).WithMessage("Yangi parol 100 belgidan oshmasligi kerak.");
    }
}
