using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class BuyurtmaCreateDtoValidator : AbstractValidator<BuyurtmaCreateDto>
{
    public BuyurtmaCreateDtoValidator()
    {
        RuleFor(x => x.YetkazishManzili)
            .NotEmpty().WithMessage("Yetkazish manzili kiritilishi kerak.")
            .MaximumLength(300).WithMessage("Manzil 300 belgidan oshmasligi kerak.");

        RuleFor(x => x.Telefon)
            .NotEmpty().WithMessage("Telefon raqami kiritilishi kerak.")
            .Matches(@"^\+998\d{9}$").WithMessage("Telefon raqami +998901234567 formatida bo'lishi kerak.");
    }
}
