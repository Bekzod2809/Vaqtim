using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class SavatSoniniOzgartirishDtoValidator : AbstractValidator<SavatSoniniOzgartirishDto>
{
    public SavatSoniniOzgartirishDtoValidator()
    {
        RuleFor(x => x.Soni)
            .GreaterThan(0).WithMessage("Soni kamida 1 bo'lishi kerak. Olib tashlash uchun o'chirish tugmasidan foydalaning.");
    }
}
