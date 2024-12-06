// Fetch structure.json
async function fetchStructure() {
    const response = await fetch('structure.json');
    return await response.json();
}

// Create dropdown for folders
function createDropdown(folder) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    const button = document.createElement('button');
    button.textContent = folder.name;
    dropdown.appendChild(button);

    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';

    folder.children.forEach(item => {
        const link = document.createElement('a');
        link.textContent = item.name;
        if (!item.isDirectory) {
            link.href = '#';
            link.onclick = (e) => {
                e.preventDefault();
                loadFile(item.path);
            };
        } else {
            link.onclick = (e) => {
                e.preventDefault();
                alert('Nested folders are not supported in the dropdown.');
            };
        }
        menu.appendChild(link);
    });

    dropdown.appendChild(menu);
    return dropdown;
}

// Render navbar
function renderNavbar(structure) {
    const navbar = document.getElementById('navbar');

    structure.children.forEach(item => {
        if (!item.isDirectory) {
            // Render standalone file as navbar link
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';

            const link = document.createElement('a');
            link.textContent = item.name;
            link.href = '#';
            link.onclick = (e) => {
                e.preventDefault();
                loadFile(item.path);
            };

            navItem.appendChild(link);
            navbar.appendChild(navItem);
        } else {
            // Render directories as dropdowns
            const dropdown = createDropdown(item);
            navbar.appendChild(dropdown);
        }
    });
}

// Load and render Markdown file
async function loadFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load file: ${filePath}`);
        const markdown = await response.text();
        const htmlContent = marked.parse(markdown);
        document.getElementById('content').innerHTML = `<div class="markdown-content">${htmlContent}</div>`;
    } catch (error) {
        document.getElementById('content').innerHTML = `<div class="markdown-content">Error: ${error.message}</div>`;
    }
}

// Initialize the app
(async () => {
    const structure = await fetchStructure();
    renderNavbar(structure);
})();
