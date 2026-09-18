using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class KirishDtoValidator : AbstractValidator<KirishDto>
{
    public KirishDtoValidator()
    {
        RuleFor(x => x.UsernameYokiEmail)
            .NotEmpty().WithMessage("Username yoki email kiritilishi kerak.");

        RuleFor(x => x.Parol)
            .NotEmpty().WithMessage("Parol kiritilishi kerak.");
    }
}
