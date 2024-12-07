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
        const markdown = await response.text();
        const htmlContent = marked.parse(markdown);

        document.getElementById('content').innerHTML = `
            <div class="markdown-content">${htmlContent}</div>
        `;

        addCopyAndCollapseActions(); // Add copy and collapsibility actions to code blocks
        hljs.highlightAll(); // Apply syntax highlighting
    } catch (error) {
        document.getElementById('content').innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
}

// Add copy-to-clipboard and collapsibility to code blocks
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
        pre.style.display = 'block';
    });
}


// Initialize the app
(async () => {
    const structure = await fetchStructure();
    if (structure) {
        renderNavbar(structure);
        hljs.highlightAll(); // Apply syntax highlighting
    }
})();
