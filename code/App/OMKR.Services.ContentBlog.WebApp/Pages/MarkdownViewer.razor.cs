using Microsoft.AspNetCore.Components;
using OMKR.Services.ContentBlog.WebApp.Data;

namespace OMKR.Services.ContentBlog.WebApp.Pages;

public partial class MarkdownViewer : ComponentBase
{
    [Parameter]
    public string? FilePath { get; set; }

    private FileNode? Root { get; set; }
    private string Content { get; set; } = string.Empty;
    private string SearchTerm { get; set; } = string.Empty;

    protected override async Task OnInitializedAsync()
    {
        // Load structure.json
        try
        {
            var json = await Http.GetStringAsync("structure.json");
            Root = System.Text.Json.JsonSerializer.Deserialize<FileNode>(json);

            // If a filePath is specified, load the corresponding file
            if (!string.IsNullOrEmpty(FilePath))
            {
                await LoadMarkdownFile(FilePath);
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error loading structure.json: {ex.Message}");
        }
    }

    private async Task LoadMarkdownFile(string filePath)
    {
        try
        {
            Content = await Http.GetStringAsync(filePath);
        }
        catch (Exception ex)
        {
            Content = $"Error loading file: {ex.Message}";
        }
    }

    private void NavigateToFile(string filePath)
    {
        Navigation.NavigateTo($"/markdownviewer/{Uri.EscapeDataString(filePath)}");
    }

    private List<FileNode>? FilteredNodes
    {
        get
        {
            if (string.IsNullOrWhiteSpace(SearchTerm))
            {
                return Root?.Children.ToList();
            }
            else
            {
                return FilterNodes(Root?.Children.ToList() ?? []);
            }
        }
    }

    private List<FileNode> FilterNodes(List<FileNode> nodes)
    {
        var result = new List<FileNode>();

        foreach (var node in nodes)
        {
            if (node.IsDirectory)
            {
                var filteredChildren = FilterNodes(node.Children.ToList() ?? []);
                if (filteredChildren.Count != 0 || node.Name.Contains(SearchTerm, StringComparison.OrdinalIgnoreCase))
                {
                    result.Add(new FileNode
                    {
                        Name = node.Name,
                        IsDirectory = node.IsDirectory,
                        Path = node.Path,
                        Children = [.. filteredChildren]
                    });
                }
            }
            else
            {
                if (node.Name.Contains(SearchTerm, StringComparison.OrdinalIgnoreCase))
                {
                    result.Add(node);
                }
            }
        }

        return result;
    }
}
