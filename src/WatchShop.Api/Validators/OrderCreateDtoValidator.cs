using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class OrderCreateDtoValidator : AbstractValidator<OrderCreateDto>
{
    public OrderCreateDtoValidator()
    {
        RuleFor(x => x.DeliveryAddress)
            .NotEmpty().WithMessage("Yetkazish manzili kiritilishi kerak.")
            .MaximumLength(300).WithMessage("Manzil 300 belgidan oshmasligi kerak.");

        RuleFor(x => x.AdditionalPhone)
            .Matches(@"^\+998\d{9}$")
            .When(x => !string.IsNullOrWhiteSpace(x.AdditionalPhone))
            .WithMessage("Qo'shimcha telefon raqami +998901234567 formatida bo'lishi kerak.");
    }
}
