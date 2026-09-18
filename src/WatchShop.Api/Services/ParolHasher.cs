namespace WatchShop.Api.Services;

public static class ParolHasher
{
    public static string Hash(string parol)
    {
        return BCrypt.Net.BCrypt.HashPassword(parol);
    }

    public static bool Verify(string parol, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(parol, hash);
    }
}
