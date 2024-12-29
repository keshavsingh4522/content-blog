using Microsoft.AspNetCore.Components;
using OMKR.Services.ContentBlog.WebApp.Data;

namespace OMKR.Services.ContentBlog.WebApp.Pages;

public partial class TreeView : ComponentBase
{
    [Parameter]
    public List<FileNode>? Nodes { get; set; }

    [Parameter]
    public EventCallback<string> OnFileSelected { get; set; }
}
