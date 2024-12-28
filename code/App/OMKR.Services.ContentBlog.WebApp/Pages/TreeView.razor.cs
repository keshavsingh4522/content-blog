using Microsoft.AspNetCore.Components;

namespace OMKR.Services.ContentBlog.WebApp.Pages;

public partial class TreeView : ComponentBase
{
    private readonly string folderPath = @"wwwroot/files"; // Folder path to load files and directories
    private string[] directories = [];
    private string[] files = [];
    private string errorMessage = string.Empty;
    private string SelectedFileName = string.Empty;
    private string SearchTerm { get; set; } = string.Empty;

    // Filtered lists for search results
    private IEnumerable<string> filteredDirectories => directories
        .Where(dir => string.IsNullOrWhiteSpace(SearchTerm) || dir.Contains(SearchTerm, StringComparison.OrdinalIgnoreCase));

    private IEnumerable<string> filteredFiles => files
        .Where(file => string.IsNullOrWhiteSpace(SearchTerm) || Path.GetFileName(file).Contains(SearchTerm, StringComparison.OrdinalIgnoreCase));

    protected override void OnInitialized()
    {
        // Load the directories and files
        LoadFolderContents(folderPath);
    }

    private void LoadFolderContents(string path)
    {
        try
        {
            if (Directory.Exists(path))
            {
                directories = Directory.GetDirectories(path);
                files = Directory.GetFiles(path, "*.md"); // Only include .md files
            }
            else
            {
                errorMessage = $"Directory '{path}' does not exist. current path: {Directory.GetCurrentDirectory()}";
            }
        }
        catch (Exception ex)
        {
            errorMessage = $"Error loading directory: {ex.Message}";
        }
    }

    private void LoadSelectedFile(string filePath)
    {
        SelectedFileName = string.Join("/", filePath.Split("/").Skip(2));
        StateHasChanged(); // Notify the UI that the component has finished loading
    }
}
