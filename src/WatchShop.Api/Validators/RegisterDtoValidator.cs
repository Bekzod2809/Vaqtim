using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Ism bo'sh bo'lmasligi kerak.")
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Ism bo'sh bo'lmasligi kerak.")
            .Matches(@"^[\p{L}\p{M}][\p{L}\p{M}\s'’ʻʼ-]*$").WithMessage("Ism faqat harf, bo'sh joy, tutuq belgisi va chiziqchadan iborat bo'lishi mumkin.")
            .MaximumLength(50).WithMessage("Ism 50 belgidan oshmasligi kerak.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Familiya bo'sh bo'lmasligi kerak.")
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Familiya bo'sh bo'lmasligi kerak.")
            .Matches(@"^[\p{L}\p{M}][\p{L}\p{M}\s'’ʻʼ-]*$").WithMessage("Familiya faqat harf, bo'sh joy, tutuq belgisi va chiziqchadan iborat bo'lishi mumkin.")
            .MaximumLength(50).WithMessage("Familiya 50 belgidan oshmasligi kerak.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Telefon raqami kiritilishi kerak.")
            .Matches(@"^\+998\d{9}$").WithMessage("Telefon raqami +998901234567 formatida bo'lishi kerak.");

        RuleFor(x => x.VerificationCode)
            .NotEmpty().WithMessage("Telegram botdan olingan kodni kiriting.")
            .Matches(@"^\d{6}$").WithMessage("Telegram botdan olingan 6 xonali kodni kiriting.");

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username bo'sh bo'lmasligi kerak.")
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Username bo'sh bo'lmasligi kerak.")
            .MinimumLength(3).WithMessage("Username kamida 3 belgidan iborat bo'lishi kerak.")
            .MaximumLength(50).WithMessage("Username 50 belgidan oshmasligi kerak.")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("Username faqat harf, raqam va pastki chiziqdan iborat bo'lishi mumkin.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Parol bo'sh bo'lmasligi kerak.")
            .Must(value => !string.IsNullOrWhiteSpace(value)).WithMessage("Parol bo'sh bo'lmasligi kerak.")
            .MinimumLength(6).WithMessage("Parol kamida 6 belgidan iborat bo'lishi kerak.")
            .MaximumLength(100).WithMessage("Parol 100 belgidan oshmasligi kerak.");
    }
}
