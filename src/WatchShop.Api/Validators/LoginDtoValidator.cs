using FluentValidation;
using WatchShop.Api.Dtos;

namespace WatchShop.Api.Validators;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.UsernameOrEmail)
            .NotEmpty().WithMessage("Username yoki email kiritilishi kerak.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Parol kiritilishi kerak.");
    }
}
