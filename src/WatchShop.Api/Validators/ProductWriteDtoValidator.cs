using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class ProductWriteDtoValidator : AbstractValidator<IProductWriteDto>
{
    public ProductWriteDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Mahsulot nomi bo'sh bo'lmasligi kerak.")
            .MaximumLength(150).WithMessage("Mahsulot nomi 150 belgidan oshmasligi kerak.");

        RuleFor(x => x.Brand)
            .NotEmpty().WithMessage("Brend nomi bo'sh bo'lmasligi kerak.")
            .MaximumLength(100).WithMessage("Brend nomi 100 belgidan oshmasligi kerak.");

        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("Mahsulot rangi bo'sh bo'lmasligi kerak.")
            .MaximumLength(50).WithMessage("Rang nomi 50 belgidan oshmasligi kerak.");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Tavsif 2000 belgidan oshmasligi kerak.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Narx 0 dan katta bo'lishi kerak.");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Ombordagi soni manfiy bo'lishi mumkin emas.");

        When(x => x.SalePrice.HasValue, () =>
        {
            RuleFor(x => x.SalePrice!.Value)
                .GreaterThan(0).WithMessage("Chegirma narxi 0 dan katta bo'lishi kerak.")
                .LessThan(x => x.Price).WithMessage("Chegirma narxi asosiy narxdan kichik bo'lishi kerak.")
                .OverridePropertyName("SalePrice");
        });
    }
}
