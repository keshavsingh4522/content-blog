using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var clientIp = context.Connection.RemoteIpAddress?.ToString();

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: clientIp ?? "anonymous",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10, // Max requests allowed per window
                Window = TimeSpan.FromMinutes(1), // Time window
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                //QueueLimit = 0 // Set to 0 to prevent queuing and immediately reject excess requests
                QueueLimit = 1  // Set to 1 to allow queuing of 1 request, other requests are rejected
            });
    });

    options.RejectionStatusCode = 429; // HTTP status code for Too Many Requests
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply the rate limiter middleware before authorization and controllers
app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers();

app.Run();
