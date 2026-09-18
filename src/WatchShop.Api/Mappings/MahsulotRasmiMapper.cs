using WatchShop.Api.Dtos;
using WatchShop.Api.Entities;

namespace WatchShop.Api.Mappings;

public static class MahsulotRasmiMapper
{
    public static MahsulotRasmiGetDto ToGetDto(this MahsulotRasmi rasm)
    {
        return new MahsulotRasmiGetDto
        {
            MahsulotRasmiId = rasm.MahsulotRasmiId,
            RasmHavolasi = rasm.RasmHavolasi,
            AsosiyRasmmi = rasm.AsosiyRasmmi
        };
    }
}
