// Fetch structure.json
async function fetchStructure() {
    try {
        const response = await fetch('structure.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch structure.json: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
        document.getElementById('content').innerHTML = `<p class="text-danger">Error loading structure: ${error.message}</p>`;
    }
}

// Create dropdowns and links for the navbar
function createDropdown(folder) {
    const dropdownItem = document.createElement('li');
    dropdownItem.className = 'nav-item dropdown';

    const button = document.createElement('a');
    button.className = 'nav-link dropdown-toggle';
    button.href = '#';
    button.id = `dropdown-${folder.name}`;
    button.setAttribute('role', 'button');
    button.setAttribute('data-bs-toggle', 'dropdown');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = folder.name;

    const menu = document.createElement('ul');
    menu.className = 'dropdown-menu';
    menu.setAttribute('aria-labelledby', `dropdown-${folder.name}`);

    folder.children.forEach((item) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'dropdown-item';
        link.textContent = item.name;

        if (!item.isDirectory) {
            link.href = '#';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadFile(item.path);
            });
        }

        listItem.appendChild(link);
        menu.appendChild(listItem);
    });

    dropdownItem.appendChild(button);
    dropdownItem.appendChild(menu);
    return dropdownItem;
}

function renderNavbar(structure) {
    const navItems = document.getElementById('nav-items');
    navItems.innerHTML = ''; // Clear existing items if any
    structure.children.forEach((item) => {
        if (!item.isDirectory) {
            // Add individual file as a navbar item
            const navItem = document.createElement('li');
            navItem.className = 'nav-item';

            const link = document.createElement('a');
            link.className = 'nav-link';
            link.textContent = item.name;
            link.href = '#';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadFile(item.path);
            });

            navItem.appendChild(link);
            navItems.appendChild(navItem);
        } else {
            // Create dropdown for folders
            const dropdown = createDropdown(item);
            navItems.appendChild(dropdown);
        }
    });
}

// Load and display markdown content
async function loadFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load file: ${filePath}`);
        let markdown = await response.text();

        // Correct image paths in the markdown content
        const basePath = filePath.substring(0, filePath.lastIndexOf('/') + 1);
        markdown = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            if (!src.startsWith('http') && !src.startsWith('/')) {
                src = basePath + src;
            }
            return `![${alt}](${src})`;
        });

        const htmlContent = marked.parse(markdown);

        document.getElementById('content').innerHTML = `
            <div class="markdown-content">${htmlContent}</div>
        `;

        addCopyAndCollapseActions(); // Add copy and collapsibility actions to code blocks
        hljs.highlightAll(); // Apply syntax highlighting

        // Store the full markdown content and file name for global actions
        window.currentMarkdownContent = markdown;
        window.currentFileName = filePath.split('/').pop();

        // Show the content area and hide the cards container
        document.getElementById('content').style.display = 'block';
        document.getElementById('cards-container').style.display = 'none';

        // Show global buttons
        document.querySelector('.global-buttons').style.display = 'flex';

        // Hide search bar, search results, and tree view container
        document.querySelector('.search-bar').style.display = 'none';
        document.getElementById('search-results').style.display = 'none';
        document.getElementById('tree-view-container').style.display = 'none';
    } catch (error) {
        document.getElementById('content').innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
}

// Add copy-to-clipboard, download, view raw content, and collapsibility to code blocks
function addCopyAndCollapseActions() {
    const preBlocks = document.querySelectorAll('pre');
    preBlocks.forEach((pre, index) => {
        // Create a wrapper for the code block
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper border rounded position-relative mb-4';
        wrapper.style.overflow = 'hidden';

        // Create header with toggle and copy buttons
        const header = document.createElement('div');
        header.className = 'code-block-header d-flex justify-content-between align-items-center px-3 py-2 bg-light border-bottom';

        // Title for the code block (optional, e.g., "Code Block X")
        const title = document.createElement('span');
        title.textContent = `Code Block ${index + 1}`;
        title.className = 'code-block-title fw-bold';

        // Create actions container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'code-actions d-flex gap-2';

        // Add Copy Button
        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-sm btn-outline-primary d-flex align-items-center gap-1';
        copyButton.innerHTML = `<i class="fas fa-copy"></i><span>Copy</span>`;
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(pre.textContent).then(() => {
                copyButton.innerHTML = `<i class="fas fa-check"></i><span>Copied</span>`;
                setTimeout(() => (copyButton.innerHTML = `<i class="fas fa-copy"></i><span>Copy</span>`), 2000);
            }).catch((err) => console.error('Failed to copy text:', err));
        });

        // Add Download Button
        const downloadButton = document.createElement('button');
        downloadButton.className = 'btn btn-sm btn-outline-success d-flex align-items-center gap-1';
        downloadButton.innerHTML = `<i class="fas fa-download"></i><span>Download</span>`;
        downloadButton.addEventListener('click', () => {
            const blob = new Blob([pre.textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `code-block-${index + 1}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        });

        // Add View Raw Content Button
        const viewRawButton = document.createElement('button');
        viewRawButton.className = 'btn btn-sm btn-outline-info d-flex align-items-center gap-1';
        viewRawButton.innerHTML = `<i class="fas fa-eye"></i><span>View Raw</span>`;
        viewRawButton.addEventListener('click', () => {
            const rawWindow = window.open('', '_blank');
            rawWindow.document.write(`<pre>${pre.textContent}</pre>`);
            rawWindow.document.close();
        });

        // Add Collapse/Expand Button
        const collapseButton = document.createElement('button');
        collapseButton.className = 'btn btn-sm btn-outline-secondary d-flex align-items-center gap-1';
        collapseButton.innerHTML = `<i class="fas fa-chevron-up"></i><span>Collapse</span>`;
        collapseButton.addEventListener('click', () => {
            pre.classList.toggle('collapsed');
            collapseButton.innerHTML = pre.classList.contains('collapsed')
                ? `<i class="fas fa-chevron-down"></i><span>Expand</span>`
                : `<i class="fas fa-chevron-up"></i><span>Collapse</span>`;
            pre.style.display = pre.classList.contains('collapsed') ? 'none' : 'block';
        });

        // Append buttons to the actions container
        actionsDiv.appendChild(copyButton);
        actionsDiv.appendChild(downloadButton);
        actionsDiv.appendChild(viewRawButton);
        actionsDiv.appendChild(collapseButton);

        // Append title and actions to the header
        header.appendChild(title);
        header.appendChild(actionsDiv);

        // Wrap the pre block
        wrapper.appendChild(header);
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Add initial styles for collapsed state
        pre.style.margin = '0';
        pre.style.padding = '1rem';
        pre.style.backgroundColor = '#f8f9fa';
    });
}

// Add global toggle button for all code blocks
function addGlobalToggleButton() {
    const globalToggleButton = document.createElement('button');
    globalToggleButton.className = 'btn btn-outline-secondary';
    globalToggleButton.innerHTML = '<i class="fas fa-code"></i>'; // Use icon instead of text
    globalToggleButton.addEventListener('click', () => {
        const preBlocks = document.querySelectorAll('pre');
        preBlocks.forEach(pre => {
            pre.classList.toggle('collapsed');
            pre.style.display = pre.classList.contains('collapsed') ? 'none' : 'block';
        });
    });
    document.querySelector('.global-buttons').appendChild(globalToggleButton);
}

// Add global buttons for view raw and download all code blocks
function addGlobalButtons() {
    const container = document.querySelector('.global-buttons');

    // Global View Raw Button
    const globalViewRawButton = document.createElement('button');
    globalViewRawButton.className = 'btn btn-outline-info';
    globalViewRawButton.innerHTML = '<i class="fas fa-eye"></i>'; // Use icon instead of text
    globalViewRawButton.addEventListener('click', () => {
        const rawWindow = window.open('', '_blank');
        rawWindow.document.write(`<pre>${window.currentMarkdownContent}</pre>`);
        rawWindow.document.close();
    });

    // Global Download Button
    const globalDownloadButton = document.createElement('button');
    globalDownloadButton.className = 'btn btn-outline-success';
    globalDownloadButton.innerHTML = '<i class="fas fa-download"></i>'; // Use icon instead of text
    globalDownloadButton.addEventListener('click', () => {
        const blob = new Blob([window.currentMarkdownContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = window.currentFileName || 'full-markdown-file.md';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Insert buttons into the global-buttons container
    container.appendChild(globalViewRawButton);
    container.appendChild(globalDownloadButton);
}

function createTreeView(structure, container) {
    const ul = document.createElement('ul');
    ul.className = 'tree-view';

    structure.children.forEach(item => {
        const li = document.createElement('li');
        if (item.isDirectory) {
            li.className = 'folder';
            li.textContent = item.name;
            li.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click event from propagating to parent elements
                li.classList.toggle('expanded');
                // Toggle visibility of child elements
                const childUl = li.querySelector('ul');
                if (childUl) {
                    childUl.style.display = childUl.style.display === 'none' ? 'block' : 'none';
                }
            });
            if (item.children) {
                const childUl = document.createElement('ul');
                childUl.style.display = 'none';
                createTreeView(item, childUl);
                li.appendChild(childUl);
            }
        } else {
            li.className = 'file';
            li.textContent = item.name;
            li.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click event from propagating to parent elements
                loadFile(item.path);
            });
        }
        ul.appendChild(li);
    });

    container.appendChild(ul);
}

function searchFiles(query, structure, results = []) {
    structure.children.forEach(item => {
        if (item.isDirectory) {
            searchFiles(query, item, results);
        } else if (item.name.toLowerCase().includes(query.toLowerCase())) {
            results.push(item);
        }
    });
    return results;
}

function renderSearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'list-group';

    results.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item file';
        li.textContent = item.name;
        li.addEventListener('click', () => loadFile(item.path));
        ul.appendChild(li);
    });

    searchResultsContainer.appendChild(ul);
}

// Hide Some blocs by default
function HideBlocs()
{
    // Hide global buttons by default
    document.querySelector('.global-buttons').style.display = 'none';
    // document.querySelector('.cards-container').style.display = 'none';
}

// Show search bar and cards container on home page
function showHomePage() {
    document.querySelector('.search-bar').style.display = 'block';
    document.getElementById('search-results').style.display = 'block';
    document.getElementById('tree-view-container').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    document.querySelector('.global-buttons').style.display = 'none';
}

// Method to clear search results when clicking outside
function clearSearchResultsOnClickOutside() {
    document.addEventListener('click', function(event) {
        var searchResults = document.getElementById('search-results');
        if (!searchResults.contains(event.target)) {
            searchResults.innerHTML = '';
        }
    });
}

// Initialize the app
(async () => {
    const structure = await fetchStructure();
    if (structure) {
        renderNavbar(structure);
        hljs.highlightAll(); // Apply syntax highlighting
        addGlobalToggleButton(); // Add global toggle button
        addGlobalButtons(); // Add global view raw and download buttons
        HideBlocs(); // Hide some blocs by default

        // Create tree view
        const treeViewContainer = document.getElementById('tree-view-container');
        createTreeView(structure, treeViewContainer);

        // Add search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
            const query = searchInput.value;
            const results = searchFiles(query, structure);
            renderSearchResults(results);
        });

        // Add event listener to the blog link to display cards
        document.querySelector('.navbar-brand').addEventListener('click', (e) => {
            e.preventDefault();
            showHomePage();
        });

        // Add event listener to clear search results on click outside
        clearSearchResultsOnClickOutside();

        // Show home page by default
        showHomePage();
    }
})();
