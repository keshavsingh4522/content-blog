# Security and Cryptography

- Cryptographic features and security mechanisms enable developers to protect sensitive data and ensure secure communications.

## Key Security Concepts

### Authentication & Authorization

- `Authentication`: Verifying the identity of a user or system (e.g., JWT, Azure AD).
    - Forms Authentication
    - Windows Authentication
    - OAuth & OpenID Connect
    - Identity Server
    - ASP.NET Core Identity
- `Authorization`: Defining access permissions (e.g., roles and policies).
    - Role-Based Authorization
    - Claims-Based Authorization
    - Policy-Based Authorization
    - Resource-Based Authorization

### Data Integrity & Confidentiality:

- `Integrity`: Ensuring data has not been altered (e.g., HMAC).
- `Confidentiality`: Encrypting data to prevent unauthorized access (e.g., AES, RSA).

### Secure Communication:

- `Transport Layer Security (TLS)`: Encrypting data in transit.

### Cryptographic Algorithms:

- `Symmetric Encryption`: AES (Advanced Encryption Standard).
- `Asymmetric Encryption`: RSA.
- `Hashing`: SHA-256, SHA-512.

```c#
/// <summary>
/// Get the sha256 checksum of file.
/// </summary>
/// <param name="content">Content of file.</param>
/// <returns>Returns the checksum of content.</returns>
public static string GetSha256Checksum(this string content)
{
    using (SHA256 sha = SHA256.Create())
    {
        byte[] checksum = sha.ComputeHash(Convert.FromBase64String(content));
        return BitConverter.ToString(checksum).Replace("-", String.Empty);
    }
}
```

## Best Practices

- Use Strong Keys:
    - Generate keys with a secure random number generator.
- Avoid Hardcoding Secrets:
    - Store secrets in secure vaults (e.g., Azure Key Vault).
- Regularly Rotate Keys:
    - Implement key rotation policies.
- Use Modern Cryptography:
    - Avoid deprecated algorithms like MD5 and DES. [DIFF](https://www.restack.io/p/secure-hashing-techniques-answer-md5-vs-des-cat-ai)
- Secure Communication:
    - Always use TLS for data in transit.

---

## HMAC

- HMAC is a cryptographic technique that combines a hash function (e.g., SHA-256) with a secret key to ensure both data integrity and authentication.
- It is widely used in APIs, JWT tokens, and secure communication protocols like TLS.

### Key Uses of HMAC

- Message Authentication
    - Verifies that a message has not been tampered with and is from the intended sender.
- API Security
    - Ensures secure communication between client and server by validating requests.
- JWT Tokens
    - Used to sign and verify the integrity of JSON Web Tokens.
- Data Integrity in File Transfers
    - Confirms data integrity when transferring files or messages over an insecure channel.

### How HMAC Works

    Input: A message (data) and a secret key (key).
    Process: Combines the key and data with a hash function (e.g., SHA-256).
    Output: A fixed-size hash, called an HMAC.
    Verification: The recipient recomputes the HMAC using the same key and compares it with the received HMAC.

### Hands On

#### Generating HMAC

```c#
using System;
using System.Security.Cryptography;
using System.Text;

class Program
{
    static void Main()
    {
        // Define the secret key and message
        string secretKey = "your_secret_key";
        string message = "This is a test message";

        // Convert key and message to byte arrays
        byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);
        byte[] messageBytes = Encoding.UTF8.GetBytes(message);

        // Create an HMACSHA256 instance with the key
        using (HMACSHA256 hmac = new HMACSHA256(keyBytes))
        {
            // Compute the HMAC
            byte[] hashBytes = hmac.ComputeHash(messageBytes);

            // Convert hash to a hexadecimal string
            string hmacHex = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

            // Output the HMAC
            Console.WriteLine("HMAC: " + hmacHex);
        }
    }
}
```

In this code:

    The HMACSHA256 class is used to create an HMAC with SHA-256.
    The secret key and message are converted to byte arrays.
    The ComputeHash method generates the HMAC value.
    The resulting HMAC is converted to a hexadecimal string for display.


#### Verifying HMAC

```c#
static bool VerifyHMAC(string originalMessage, string secretKey, string receivedHmac)
{
    // Convert key and message to byte arrays
    byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);
    byte[] messageBytes = Encoding.UTF8.GetBytes(originalMessage);

    // Create an HMACSHA256 instance with the key
    using (HMACSHA256 hmac = new HMACSHA256(keyBytes))
    {
        // Compute the HMAC
        byte[] computedHashBytes = hmac.ComputeHash(messageBytes);

        // Convert computed HMAC to a hexadecimal string
        string computedHmac = BitConverter.ToString(computedHashBytes).Replace("-", "").ToLower();

        // Compare the computed HMAC with the received HMAC
        return computedHmac.Equals(receivedHmac, StringComparison.OrdinalIgnoreCase);
    }
}
```


## Reference

- [Implementing HMAC-Based Authentication in C#](https://medium.com/@rajesh.gsn9/implementing-hmac-based-authentication-in-c-31755d3f21a2)
- [HMACSHA256 Class](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.hmacsha256)