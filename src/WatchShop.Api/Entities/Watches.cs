using WatchShop.Api.Enums;

namespace WatchShop.Api.Entities;

public class Watches : Product
{
    public MovementType Movement { get; set; }
}
