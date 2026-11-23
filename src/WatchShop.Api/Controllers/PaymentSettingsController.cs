using System.Text.RegularExpressions;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchShop.Api.Data;
using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;
using WatchShop.Api.Validators;

namespace WatchShop.Api.Controllers;

[Route("api/payment-settings")]
[ApiController]
public class PaymentSettingsController : ControllerBase
{
    private readonly AppDbContext Db;
    private readonly IValidator<PaymentSettingDto> Validator;

    public PaymentSettingsController(AppDbContext db, IValidator<PaymentSettingDto> validator)
    {
        Db = db;
        Validator = validator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<PaymentSettingDto> Get()
    {
        var setting = await Db.PaymentSettings
            .AsNoTracking()
            .OrderBy(x => x.PaymentSettingId)
            .FirstOrDefaultAsync();

        return new PaymentSettingDto
        {
            CardNumber = setting?.CardNumber ?? "8600 0000 0000 0000",
            CardHolder = setting?.CardHolder ?? "Vaqtim"
        };
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<PaymentSettingDto> Update(PaymentSettingDto dto)
    {
        Validator.Validate(dto);

        var digits = Regex.Replace(dto.CardNumber, @"\D", string.Empty);
        var formattedCard = $"{digits[..4]} {digits[4..8]} {digits[8..12]} {digits[12..16]}";
        var cardHolder = string.IsNullOrWhiteSpace(dto.CardHolder) ? null : dto.CardHolder.Trim();

        var setting = await Db.PaymentSettings
            .OrderBy(x => x.PaymentSettingId)
            .FirstOrDefaultAsync();

        if (setting == null)
        {
            setting = new PaymentSetting
            {
                CardNumber = formattedCard,
                CardHolder = cardHolder,
                UpdatedAt = DateTime.UtcNow
            };
            await Db.PaymentSettings.AddAsync(setting);
        }
        else
        {
            setting.CardNumber = formattedCard;
            setting.CardHolder = cardHolder;
            setting.UpdatedAt = DateTime.UtcNow;
        }

        await Db.SaveChangesAsync();

        return new PaymentSettingDto
        {
            CardNumber = setting.CardNumber,
            CardHolder = setting.CardHolder
        };
    }
}
