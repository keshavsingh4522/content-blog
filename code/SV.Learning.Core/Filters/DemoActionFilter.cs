using Microsoft.AspNetCore.Mvc.Filters;

namespace SV.Learning.Core.Filters;

public class DemoAsyncActionFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Code to run before the action executes
        await next(); // This calls the action method
        // Code to run after the action executes
    }
}

public class DemoActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        // Code to run before the action executes
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // Code to run after the action executes
    }
}
