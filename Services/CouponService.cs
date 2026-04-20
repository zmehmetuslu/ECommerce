using ECommerceAPI.DTOs;
using ECommerceAPI.Entities;
using ECommerceAPI.Repositories;

namespace ECommerceAPI.Services;

public class CouponService
{
    private readonly CouponRepository _couponRepository;
    private readonly UserRepository _userRepository;

    public CouponService(
        CouponRepository couponRepository,
        UserRepository userRepository)
    {
        _couponRepository = couponRepository;
        _userRepository = userRepository;
    }

    public CouponValidationResultDto Validate(ValidateCouponDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Code))
        {
            return new CouponValidationResultDto
            {
                IsValid = false,
                Message = "Kupon kodu boş olamaz."
            };
        }
        var normalizedCode = dto.Code.Trim().ToUpperInvariant();

        var coupon = _couponRepository.GetByCode(normalizedCode);
        if (coupon == null || !coupon.IsActive)
        {
            return new CouponValidationResultDto
            {
                IsValid = false,
                Message = "Geçersiz kupon kodu."
            };
        }

        if (coupon.ExpireAt.HasValue && coupon.ExpireAt.Value < DateTime.UtcNow)
        {
            return new CouponValidationResultDto
            {
                IsValid = false,
                Message = "Bu kuponun süresi dolmuş."
            };
        }

        if (coupon.UsageLimit.HasValue && coupon.UsedCount >= coupon.UsageLimit.Value)
        {
            return new CouponValidationResultDto
            {
                IsValid = false,
                Message = "Bu kuponun kullanım limiti dolmuş."
            };
        }

        if (!string.IsNullOrWhiteSpace(dto.Username))
        {
            var user = _userRepository.GetUserByUsername(dto.Username);
            if (user != null && coupon.PerUserLimit > 0)
            {
                var usedByUser = _couponRepository.GetUserUsageCount(coupon.Id, user.Id);
                if (usedByUser >= coupon.PerUserLimit)
                {
                    return new CouponValidationResultDto
                    {
                        IsValid = false,
                        Message = "Bu kuponu kullanım hakkın dolmuş."
                    };
                }
            }
        }

        if (dto.SubTotal < coupon.MinTotal)
        {
            return new CouponValidationResultDto
            {
                IsValid = false,
                Message = $"Bu kupon için minimum sepet tutarı {coupon.MinTotal} ₺ olmalı."
            };
        }

        var result = new CouponValidationResultDto
        {
            IsValid = true,
            Code = coupon.Code
        };

        if (coupon.Type == "rate")
        {
            result.DiscountAmount = Math.Min(dto.SubTotal, dto.SubTotal * coupon.Value / 100m);
            result.Message = $"%{coupon.Value} indirim uygulandı.";
            return result;
        }

        if (coupon.Type == "fixed")
        {
            result.DiscountAmount = Math.Min(dto.SubTotal, coupon.Value);
            result.Message = $"{coupon.Value} ₺ indirim uygulandı.";
            return result;
        }

        if (coupon.Type == "free_shipping")
        {
            result.ShippingDiscount = dto.ShippingFee;
            result.Message = "Kargo ücretsiz kuponu uygulandı.";
            return result;
        }

        return new CouponValidationResultDto
        {
            IsValid = false,
            Message = "Kupon tipi desteklenmiyor."
        };
    }

    public List<CouponAdminDto> GetAllForAdmin()
    {
        return _couponRepository.GetAll()
            .Select(c => new CouponAdminDto
            {
                Id = c.Id,
                Code = c.Code,
                Type = c.Type,
                Value = c.Value,
                MinTotal = c.MinTotal,
                IsActive = c.IsActive,
                ExpireAt = c.ExpireAt,
                UsageLimit = c.UsageLimit,
                UsedCount = c.UsedCount,
                PerUserLimit = c.PerUserLimit
            })
            .ToList();
    }

    public (bool Success, string Message) CreateCoupon(CreateCouponDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Code))
        {
            return (false, "Kupon kodu zorunlu.");
        }
        var code = dto.Code.Trim().ToUpperInvariant();

        if (_couponRepository.GetByCode(code) != null)
        {
            return (false, "Bu kupon kodu zaten mevcut.");
        }

        if (dto.PerUserLimit < 1)
        {
            return (false, "Kullanıcı başı limit en az 1 olmalı.");
        }

        _couponRepository.Add(new Coupon
        {
            Code = code,
            Type = dto.Type.Trim().ToLowerInvariant(),
            Value = dto.Value,
            MinTotal = dto.MinTotal,
            UsageLimit = dto.UsageLimit,
            PerUserLimit = dto.PerUserLimit,
            ExpireAt = dto.ExpireAt,
            IsActive = true,
            UsedCount = 0
        });

        return (true, "Kupon başarıyla oluşturuldu.");
    }

    public (bool Success, string Message) ToggleActive(int couponId)
    {
        var coupon = _couponRepository.GetById(couponId);
        if (coupon == null)
        {
            return (false, "Kupon bulunamadı.");
        }

        coupon.IsActive = !coupon.IsActive;
        _couponRepository.Update(coupon);
        return (true, coupon.IsActive ? "Kupon aktif edildi." : "Kupon pasif edildi.");
    }

    public (bool Success, string Message) ConsumeCoupon(
        string? code,
        string username,
        decimal subTotal,
        decimal shippingFee)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return (true, "Kupon kullanılmadı.");
        }

        var validation = Validate(new ValidateCouponDto
        {
            Code = code,
            SubTotal = subTotal,
            ShippingFee = shippingFee,
            Username = username
        });

        if (!validation.IsValid)
        {
            return (false, validation.Message);
        }

        var coupon = _couponRepository.GetByCode(code.Trim().ToUpperInvariant());
        var user = _userRepository.GetUserByUsername(username);
        if (coupon == null || user == null)
        {
            return (false, "Kupon doğrulanamadı.");
        }

        coupon.UsedCount += 1;
        _couponRepository.Update(coupon);
        _couponRepository.AddUsage(new CouponUsage
        {
            CouponId = coupon.Id,
            UserId = user.Id,
            UsedAt = DateTime.UtcNow
        });

        return (true, "Kupon uygulandı.");
    }
}
