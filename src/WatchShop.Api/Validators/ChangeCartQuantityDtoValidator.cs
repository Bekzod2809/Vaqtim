using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class ChangeCartQuantityDtoValidator : AbstractValidator<ChangeCartQuantityDto>
{
    public ChangeCartQuantityDtoValidator()
    {
        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Soni kamida 1 bo'lishi kerak. Olib tashlash uchun o'chirish tugmasidan foydalaning.");
    }
}
