// ========================================
// ENHANCED FOOTER FUNCTIONALITY
// ========================================

// Initialize footer loading when DOM is ready
function initFooterLoading() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooterContent);
    } else {
        loadFooterContent();
    }
}

// Load footer HTML with improved error handling
function loadFooterContent() {
    const footerContainer = document.getElementById('footer-container');
    
    if (!footerContainer) {
        console.warn('Footer container not found, retrying in 100ms...');
        setTimeout(loadFooterContent, 100);
        return;
    }

    // Use traditional fetch with proper promise handling
    fetch('ui/common/footer/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            footerContainer.innerHTML = data;
            
            // Initialize footer functionality after loading
            setTimeout(initializeFooter, 50); // Small delay to ensure DOM is updated
        })
        .catch(error => {
            console.error('Failed to load footer:', error);
            
            // Fallback footer content
            footerContainer.innerHTML = `
                <footer class="bg-dark text-white py-4 mt-5">
                    <div class="container text-center">
                        <p class="mb-0">&copy; 2024 <a href="https://www.keshavsingh.net" class="text-white">Keshav Singh</a>. All rights reserved.</p>
                    </div>
                </footer>
            `;
            
            // Still initialize basic functionality for fallback
            setTimeout(initializeFooter, 50);
        });
}

// Start the footer loading process
initFooterLoading();

// Initialize footer functionality
function initializeFooter() {
    // Add fade-in animation
    const footer = document.querySelector('footer');
    if (footer) {
        footer.classList.add('footer-fade-in');
    }
    
    // Newsletter subscription
    initializeNewsletter();
    
    // Add smooth scroll to footer links
    initializeFooterLinks();
    
    // Add hover effects to social media icons
    initializeSocialMediaEffects();
}

// Newsletter subscription functionality
function initializeNewsletter() {
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = e.target.querySelector('input[type="email"]').value;
            if (isValidEmail(email)) {
                // Simulate newsletter subscription
                showToast('Thank you for subscribing to our newsletter!', 'success');
                e.target.reset();
            } else {
                showToast('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize footer links functionality
function initializeFooterLinks() {
    // Add keyboard navigation support for footer links
    const footerLinks = document.querySelectorAll('.footer-links a, .footer-social-icons a');
    footerLinks.forEach(link => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.target.click();
            }
        });
    });
}

// Social media effects
function initializeSocialMediaEffects() {
    const socialIcons = document.querySelectorAll('.footer-social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Global functions for footer links (available to HTML onclick handlers)

// Load category files function
window.loadCategoryFiles = function(category) {
    // This function would filter and show files from a specific category
    console.log(`Loading ${category} files...`);
    
    // Show toast notification
    showToast(`Browsing ${category} tutorials...`, 'info');
    
    // Trigger search for the category
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = category;
        searchInput.dispatchEvent(new Event('input'));
        
        // Scroll to search results
        setTimeout(() => {
            const searchResults = document.getElementById('search-results');
            if (searchResults && searchResults.style.display !== 'none') {
                searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }
};

// Show privacy policy modal
window.showPrivacyPolicy = function() {
    showModal('Privacy Policy', `
        <div class="mb-3">
            <h5>Information We Collect</h5>
            <p>This website is a static blog that does not collect personal information. We may use Google Analytics or similar services to understand website usage.</p>
        </div>
        <div class="mb-3">
            <h5>Cookies</h5>
            <p>This site may use cookies to store your theme preference and improve your browsing experience.</p>
        </div>
        <div class="mb-3">
            <h5>Contact</h5>
            <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:keshavsingh4522@gmail.com">keshavsingh4522@gmail.com</a>.</p>
        </div>
    `);
};

// Show terms of service modal
window.showTermsOfService = function() {
    showModal('Terms of Service', `
        <div class="mb-3">
            <h5>Use License</h5>
            <p>The content on this blog is provided for educational purposes. You may view, download, and print content for personal, non-commercial use.</p>
        </div>
        <div class="mb-3">
            <h5>Disclaimer</h5>
            <p>The information on this website is provided on an "as is" basis. The author makes no representations or warranties of any kind.</p>
        </div>
        <div class="mb-3">
            <h5>Contact</h5>
            <p>Questions about the Terms of Service should be sent to <a href="mailto:keshavsingh4522@gmail.com">keshavsingh4522@gmail.com</a>.</p>
        </div>
    `);
};

// Generic modal function
function showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('footer-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'footer-modal';
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Update modal content
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-body').innerHTML = content;
    
    // Show modal using Bootstrap
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// Toast notification function (used by newsletter)
function showToast(message, type = 'info') {
    // Use the existing Utils.showToast if available, otherwise create simple toast
    if (typeof Utils !== 'undefined' && Utils.showToast) {
        Utils.showToast(message, type);
    } else {
        // Simple fallback toast
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed`;
        toast.style.cssText = 'top: 100px; right: 20px; z-index: 9999; opacity: 0; transition: opacity 0.3s ease; max-width: 300px;';
        toast.innerHTML = `
            <strong>${type === 'error' ? 'Error!' : type === 'success' ? 'Success!' : 'Info'}</strong>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.style.opacity = '1', 100);
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
}