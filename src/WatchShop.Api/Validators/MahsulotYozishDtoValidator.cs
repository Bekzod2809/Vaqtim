using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class MahsulotYozishDtoValidator : AbstractValidator<IMahsulotYozishDto>
{
    public MahsulotYozishDtoValidator()
    {
        RuleFor(x => x.Nomi)
            .NotEmpty().WithMessage("Mahsulot nomi bo'sh bo'lmasligi kerak.")
            .MaximumLength(150).WithMessage("Mahsulot nomi 150 belgidan oshmasligi kerak.");

        RuleFor(x => x.Brendi)
            .NotEmpty().WithMessage("Brend nomi bo'sh bo'lmasligi kerak.")
            .MaximumLength(100).WithMessage("Brend nomi 100 belgidan oshmasligi kerak.");

        RuleFor(x => x.Rangi)
            .NotEmpty().WithMessage("Mahsulot rangi bo'sh bo'lmasligi kerak.")
            .MaximumLength(50).WithMessage("Rang nomi 50 belgidan oshmasligi kerak.");

        RuleFor(x => x.Tavsifi)
            .MaximumLength(2000).WithMessage("Tavsif 2000 belgidan oshmasligi kerak.");

        RuleFor(x => x.Narxi)
            .GreaterThan(0).WithMessage("Narx 0 dan katta bo'lishi kerak.");

        RuleFor(x => x.OmbordagiSoni)
            .GreaterThanOrEqualTo(0).WithMessage("Ombordagi soni manfiy bo'lishi mumkin emas.");

        When(x => x.ChegirmaNarxi.HasValue, () =>
        {
            RuleFor(x => x.ChegirmaNarxi!.Value)
                .GreaterThan(0).WithMessage("Chegirma narxi 0 dan katta bo'lishi kerak.")
                .LessThan(x => x.Narxi).WithMessage("Chegirma narxi asosiy narxdan kichik bo'lishi kerak.")
                .OverridePropertyName("ChegirmaNarxi");
        });
    }
}
