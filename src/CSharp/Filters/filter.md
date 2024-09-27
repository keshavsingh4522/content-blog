# Filter

## Filter types

Each filter type is executed at a different stage in the filter pipeline:

1. Authorization filters:

- Run first.
- Determine whether the user is authorized for the request.
- Short-circuit the pipeline if the request is not authorized.

2. Resource filters:

- Run after authorization.
- OnResourceExecuting runs code before the rest of the filter pipeline. For example, OnResourceExecuting runs code before model binding.
- OnResourceExecuted runs code after the rest of the pipeline has completed.

3. Action filters:

- Run immediately before and after an action method is called.
- Can change the arguments passed into an action.
- Can change the result returned from the action.
- Are not supported in Razor Pages.

4. Endpoint filters:

- Run immediately before and after an action method is called.
- Can change the arguments passed into an action.
- Can change the result returned from the action.
- Are not supported in Razor Pages.
- Can be invoked on both actions and route handler-based endpoints.

5. Exception filters apply global policies to unhandled exceptions that occur before the response body has been written to.

6. Result filters:

- Run immediately before and after the execution of action results.
- Run only when the action method executes successfully.
- Are useful for logic that must surround view or formatter execution

## References

- [https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/filters](https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/filters)