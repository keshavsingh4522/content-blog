//using Markdig;
//using Microsoft.AspNetCore.Components;

//namespace OMKR.Services.ContentBlog.WebApp.Pages;

//public partial class MarkdownViewer : ComponentBase
//{
//    [Parameter]
//    public string? SelectedFile { get; set; }
//    private string RenderedHtml = string.Empty;

//    protected override async Task OnInitializedAsync()
//    {
//        try
//        {
//            // Fetch fil path from query string
//            var uri = new Uri(NavigationManager.Uri);
//            var query = QueryHelpers.ParseQuery(uri.Query);
//            if (query.TryGetValue("file", out Microsoft.Extensions.Primitives.StringValues value))
//            {
//                SelectedFile = value;
//            }

//            // Fetch file from naviationManager
//            await LoadMarkdown(SelectedFile);

//            // Notify the UI that the component has finished loading
//            StateHasChanged();
//        }
//        catch (Exception ex)
//        {
//            RenderedHtml = $"<p>Error loading files: {ex.Message}</p>";
//        }
//    }

//    protected override async Task OnParametersSetAsync()
//    {
//        // Logic to reload or fetch the new file when SelectedFile changes
//        if (!string.IsNullOrEmpty(SelectedFile))
//        {
//            // Assuming you have a method to load the file content
//            await LoadMarkdown(SelectedFile);
//            StateHasChanged(); // Ensure the component is re-rendered
//        }
//    }

//    private async Task LoadMarkdown(string? fileName)
//    {
//        try
//        {
//            var httpClient = HttpClientFactory.CreateClient("markdown");

//            // Fetch the selected Markdown file
//            var markdownContent = await httpClient.GetStringAsync($"{NavigationManager.BaseUri}files\\{fileName}");

//            // Configure the pipeline for Markdown processing
//            var pipeline = new Markdig.MarkdownPipelineBuilder()
//                .UseAdvancedExtensions() // Enable tables and other extensions
//                .Build();

//            // Convert Markdown to HTML
//            RenderedHtml = Markdig.Markdown.ToHtml(markdownContent, pipeline);
//        }
//        catch (Exception ex)
//        {
//            RenderedHtml = $"<p>Error loading Markdown file '{fileName}': {ex.Message}</p>";
//        }
//    }
//}
