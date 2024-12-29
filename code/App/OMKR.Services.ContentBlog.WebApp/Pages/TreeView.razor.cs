//using Microsoft.AspNetCore.Components;
//using OMKR.Services.ContentBlog.WebApp.Data;
//using System.Net.Http.Json;

//namespace OMKR.Services.ContentBlog.WebApp.Pages;

//public partial class TreeView : ComponentBase
//{
//    private FileNode? RootNode = new();

//    protected override async Task OnInitializedAsync()
//    {
//        var rootNode = await HttpClient.GetFromJsonAsync<FileNode>("structure.json");
//        if (rootNode != null)
//        {
//            RootNode = rootNode;
//        }

//        Console.WriteLine(rootNode.Name, rootNode.Children.Count());
//    }
//}
