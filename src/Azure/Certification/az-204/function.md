# Azure Function

## What are Azure Functions?

    Serverless compute service to run event-driven code without managing infrastructure.
    Use cases: Data processing, APIs, automation.

## Triggers

    Define how the function is invoked.
    Examples: HTTP Trigger, Timer Trigger, Queue Trigger, Blob Trigger.

```c#
[FunctionName("HttpExample")]
public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
{
    return new OkObjectResult("Triggered by HTTP request.");
}
```

## Bindings

    Connect to other Azure resources without code (Input and Output bindings).
    Example: Write data to a Blob.

```c#
        [FunctionName("BlobOutputExample")]
        public async Task Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req,
                              [Blob("sample-container/{rand-guid}.txt", FileAccess.Write)] Stream outputBlob)
        {
            using var writer = new StreamWriter(outputBlob);
            await writer.WriteAsync("Data written to blob!");
        }
```

## Authorization Levels
        Anonymous, Function, Admin for securing HTTP functions.

### Anonymous: No authentication required.

    Use case: Public endpoints like health checks.
    Example:

```c#
    [FunctionName("PublicEndpoint")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        return new OkObjectResult("This is a public endpoint.");
    }
```

### Function: Requires a function key (provided in the query string or headers).

    Use case: Internal or shared APIs where keys are distributed.
    Example:

```c#
    [FunctionName("InternalApi")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
    {
        return new OkObjectResult("Function-level secured endpoint.");
    }
```

### Admin: Requires an admin key.

    Use case: Management or admin-only operations.
    Example:

```c#
        [FunctionName("AdminApi")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Admin, "delete")] HttpRequest req)
        {
            return new OkObjectResult("Admin-level secured endpoint.");
        }
```

Key Points:

    Function and Admin keys can be managed in the Azure Portal.
    Combine authorization levels with Azure AD or custom authentication for added security.
### Difference Between Function and Admin Authorization:

| Aspect     | Function | Admin |
| ---------- | -------- | ------- |
| Access Key | Requires Function Key |	Requires Admin Key |
| Scope	     | Limited to specific function(s) |	Grants access to all functions in the app |
| Use Case	 | Per-function secured access |	Global administrative operations |

## Durable Functions
        Build stateful workflows using an orchestrator.
        Use cases: Long-running processes like approval workflows.

    Hosting Plans
        Consumption Plan: Auto-scale, pay-per-execution.
        Premium Plan: Pre-warmed instances for lower latency.
        Dedicated Plan: Runs on pre-allocated VMs.

## Deployment
        Methods: Azure Portal, VS Code, Azure DevOps, GitHub Actions.
        Tools: Azure CLI, ARM Templates, Terraform.

## Scaling
        Automatically scales based on the trigger (e.g., HTTP requests, queue size).

## Monitoring
        Use Azure Monitor, Application Insights, or Log Analytics.

Example: Timer Trigger

```c#
[FunctionName("TimerExample")]
public void Run([TimerTrigger("0 */5 * * * *")] TimerInfo timer, ILogger log)
{
    log.LogInformation($"Function executed at: {DateTime.Now}");
}
```

Key Features:

    Language Support: C#, JavaScript, Python, Java, etc.
    Integration: Azure Storage, Cosmos DB, Service Bus, Event Grid.
    Dev Tools: Local testing with Azure Functions Core Tools.

## Cron format

Azure Functions use a six-field CRON format:

```
{second} {minute} {hour} {day} {month} {day-of-week}

Range
Second: Values from 0–59.
Minute: Values from 0–59.
Hour: Values from 0–23.
Day: Values from 1–31.
Month: Values from 1–12.
Day-of-week: Values from 0–7 (Sunday is both 0 and 7).
```

Explanation of 0 */5 * * * *

    0: At the 0th second of the minute.
    */5: Every 5 minutes.
    *: Every hour, every day, every month, and every day of the week.

Result: Runs every 5 minutes, at the start of each minute (e.g., 12:00:00, 12:05:00, etc.).

Common CRON Examples
| Expression     |	Description |
| -------------- | ------------ |
| 0 0 * * * *    |	Every hour (on the hour). |
| 0 0 9 * * *    |	Daily at 9:00 AM. |
| 0 0 9 * * 1    |	Every Monday at 9:00 AM. |
| 0 0 9 1 * *    |	At 9:00 AM on the 1st of every month. |
| 0 0 9 1 1 *    |	At 9:00 AM on January 1st. |
| 0 0/15 * * * * |	Every 15 minutes. |

## Runtime Storage Account:

Purpose of AzureWebJobsStorage:
The storage account is used by the Azure Functions runtime for several operational tasks, including:

    Key Management: Storing cryptographic keys and managing secure secrets.
    Timer Trigger Management: Managing state for timer-based triggers.
    Logging: Storing execution logs and runtime information.
    Event Hubs Checkpoints: Saving checkpoints to ensure reliable processing of Event Hub events.
    
```
Azure Functions Runtime
        │
        ▼
AzureWebJobsStorage (Azurite in Local Development)
   ┌───────────────────────────────┐
   │ - Key Management              │
   │ - Timer Trigger State         │
   │ - Logging                     │
   │ - Event Hubs Checkpoints      │
   └───────────────────────────────┘
```