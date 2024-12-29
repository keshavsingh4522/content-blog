namespace OMKR.Services.ContentBlog.WebApp.Data;

public class FileNode
{
    public string Name { get; set; }
    public bool IsDirectory { get; set; }
    public string Path { get; set; }
    public FileNode[] Children { get; set; }
}
