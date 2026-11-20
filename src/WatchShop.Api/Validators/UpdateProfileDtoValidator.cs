using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
{
    public UpdateProfileDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Ism kiritilishi kerak.")
            .Matches(@"^[\p{L}\p{M}][\p{L}\p{M}\s'’ʻʼ-]*$").WithMessage("Ism faqat harflardan iborat bo'lishi kerak.")
            .MaximumLength(50).WithMessage("Ism 50 belgidan oshmasligi kerak.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Familiya kiritilishi kerak.")
            .Matches(@"^[\p{L}\p{M}][\p{L}\p{M}\s'’ʻʼ-]*$").WithMessage("Familiya faqat harflardan iborat bo'lishi kerak.")
            .MaximumLength(50).WithMessage("Familiya 50 belgidan oshmasligi kerak.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Telefon raqami kiritilishi kerak.")
            .Matches(@"^\+998\d{9}$").WithMessage("Telefon +998901234567 formatida bo'lishi kerak.");

        RuleFor(x => x.VerificationCode)
            .Matches(@"^\d{6}$")
            .When(x => !string.IsNullOrEmpty(x.VerificationCode))
            .WithMessage("Tasdiqlash kodi 6 ta raqam bo'lishi kerak.");

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username kiritilishi kerak.")
            .MinimumLength(3).WithMessage("Username kamida 3 belgidan iborat bo'lishi kerak.")
            .MaximumLength(50).WithMessage("Username 50 belgidan oshmasligi kerak.")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("Username faqat harf, raqam va pastki chiziqdan iborat bo'lishi mumkin.");
    }
}
