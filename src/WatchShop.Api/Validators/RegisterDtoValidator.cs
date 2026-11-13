using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Ism bo'sh bo'lmasligi kerak.")
            .MaximumLength(50).WithMessage("Ism 50 belgidan oshmasligi kerak.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Familiya bo'sh bo'lmasligi kerak.")
            .MaximumLength(50).WithMessage("Familiya 50 belgidan oshmasligi kerak.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email bo'sh bo'lmasligi kerak.")
            .EmailAddress().WithMessage("Email formati noto'g'ri.")
            .MaximumLength(150).WithMessage("Email 150 belgidan oshmasligi kerak.");

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username bo'sh bo'lmasligi kerak.")
            .MinimumLength(3).WithMessage("Username kamida 3 belgidan iborat bo'lishi kerak.")
            .MaximumLength(50).WithMessage("Username 50 belgidan oshmasligi kerak.")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("Username faqat harf, raqam va pastki chiziqdan iborat bo'lishi mumkin.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Parol bo'sh bo'lmasligi kerak.")
            .MinimumLength(6).WithMessage("Parol kamida 6 belgidan iborat bo'lishi kerak.")
            .MaximumLength(100).WithMessage("Parol 100 belgidan oshmasligi kerak.");
    }
}
