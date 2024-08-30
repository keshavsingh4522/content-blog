// Ignore Spelling: App OOP

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SV.Learning.Core.OOPS.Constructors;

namespace SV.OOP.App.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OopsController : ControllerBase
{
    #region Constructor
    // call the static constructor of the class
    [HttpGet("StaticConstructor1")]
    public string StaticConst()
    {
        // call the static constructor of the class
        var result = new StaticConstructor();
        return $"Static Constructor called, {result} time";
    }

    // call the static constructor of the class
    [HttpGet("StaticConstructor2")]
    public string StaticConst2()
    {
        // call the static constructor of the class
        var result = new StaticConstructor();
        return $"Static Constructor called, {result} time";
    }

    // call the private constructor of the class
    [HttpGet("PrivateConstructor")]
    public string PrivateConst()
    {
        // call the private constructor of the class
        var result = new PrivateConstructor(10, 20);
        return $"Private Constructor called, {result.Total}";
    }
    #endregion
}