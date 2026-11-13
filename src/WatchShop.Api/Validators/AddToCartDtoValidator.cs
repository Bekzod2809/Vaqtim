using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class AddToCartDtoValidator : AbstractValidator<AddToCartDto>
{
    public AddToCartDtoValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("Mahsulot tanlanmagan.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Soni kamida 1 bo'lishi kerak.");
    }
}
