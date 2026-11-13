namespace WatchShop.Api.Entities;

public class OrderItem
{
    public long OrderItemId { get; set; }

    // Buyurtma paytidagi nom va narx nusxasi: mahsulot keyin o'zgarsa yoki o'chsa ham buyurtma tarixi saqlanadi
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }

    public long OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public long? ProductId { get; set; }
    public Product? Product { get; set; }
}
