namespace ECommerceAPI.Services;

public static class OrderStatusRules
{
    public const string Pending = "Pending";
    public const string Preparing = "Preparing";
    public const string Shipped = "Shipped";
    public const string Delivered = "Delivered";
    public const string Cancelled = "Cancelled";

    private static readonly string[] ValidStatuses =
    [
        Pending,
        Preparing,
        Shipped,
        Delivered,
        Cancelled
    ];

    public static bool IsValid(string status)
    {
        return ValidStatuses.Contains(status);
    }

    public static bool CanTransition(string currentStatus, string newStatus)
    {
        if (currentStatus == newStatus)
        {
            return true;
        }

        return currentStatus switch
        {
            Pending => newStatus is Preparing or Cancelled,
            Preparing => newStatus is Shipped or Cancelled,
            Shipped => newStatus == Delivered,
            Delivered => false,
            Cancelled => false,
            _ => false
        };
    }
}
