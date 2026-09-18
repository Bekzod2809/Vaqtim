using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class SavatgaQoshishDtoValidator : AbstractValidator<SavatgaQoshishDto>
{
    public SavatgaQoshishDtoValidator()
    {
        RuleFor(x => x.MahsulotId)
            .GreaterThan(0).WithMessage("Mahsulot tanlanmagan.");

        RuleFor(x => x.Soni)
            .GreaterThan(0).WithMessage("Soni kamida 1 bo'lishi kerak.");
    }
}
