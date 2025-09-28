/**
 * File Structure Auto-Updater
 * This module provides functionality to automatically update structure.json
 * when files or folders are added/deleted in the src directory.
 */

class StructureUpdater {
    constructor() {
        this.isWatching = false;
        this.lastStructureHash = null;
        this.checkInterval = 30000; // Check every 30 seconds
        this.intervalId = null;
    }

    /**
     * Calculate a simple hash of the structure for change detection
     */
    calculateStructureHash(structure) {
        const stringify = (obj) => {
            if (Array.isArray(obj)) {
                return '[' + obj.map(stringify).join(',') + ']';
            }
            if (obj && typeof obj === 'object') {
                const keys = Object.keys(obj).sort();
                return '{' + keys.map(key => `"${key}":${stringify(obj[key])}`).join(',') + '}';
            }
            return JSON.stringify(obj);
        };
        
        // Create a simplified structure for hashing (just paths and names)
        const simplify = (item) => {
            const simple = {
                name: item.name,
                path: item.path,
                isDirectory: item.isDirectory
            };
            if (item.children) {
                simple.children = item.children.map(simplify).sort((a, b) => a.path.localeCompare(b.path));
            }
            return simple;
        };

        const simplified = simplify(structure);
        return this.simpleHash(stringify(simplified));
    }

    /**
     * Simple hash function for strings
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    /**
     * Check if the structure has changed
     */
    async checkForChanges() {
        try {
            // Fetch current structure
            const response = await fetch('structure.json?' + Date.now()); // Cache busting
            if (!response.ok) {
                console.warn('Could not fetch structure.json for update check');
                return false;
            }
            
            const currentStructure = await response.json();
            const currentHash = this.calculateStructureHash(currentStructure);
            
            if (this.lastStructureHash === null) {
                this.lastStructureHash = currentHash;
                return false; // First run, no change
            }
            
            const hasChanged = currentHash !== this.lastStructureHash;
            if (hasChanged) {
                console.log('📁 Structure changes detected');
                this.lastStructureHash = currentHash;
                
                // Trigger UI update
                this.onStructureChanged(currentStructure);
            }
            
            return hasChanged;
            
        } catch (error) {
            console.error('Error checking for structure changes:', error);
            return false;
        }
    }

    /**
     * Handle structure changes
     */
    onStructureChanged(newStructure) {
        // Update the tree view
        const treeContainer = document.getElementById('tree-view-container');
        if (treeContainer && window.createEnhancedTreeView) {
            console.log('🔄 Updating tree view with new structure');
            try {
                createEnhancedTreeView(newStructure, treeContainer);
                
                // Show notification
                if (window.Utils && window.Utils.showToast) {
                    Utils.showToast('File structure updated!', 'info');
                }
            } catch (error) {
                console.error('Error updating tree view:', error);
                if (window.Utils && window.Utils.showToast) {
                    Utils.showToast('Error updating file structure', 'error');
                }
            }
        } else {
            console.warn('Tree container or createEnhancedTreeView not found');
        }
    }

    /**
     * Start watching for structure changes
     */
    startWatching() {
        if (this.isWatching) {
            console.log('Already watching for structure changes');
            return;
        }

        console.log('👀 Started watching for structure changes');
        this.isWatching = true;
        
        // Initial check
        this.checkForChanges();
        
        // Set up periodic checks
        this.intervalId = setInterval(() => {
            this.checkForChanges();
        }, this.checkInterval);
    }

    /**
     * Stop watching for structure changes
     */
    stopWatching() {
        if (!this.isWatching) {
            return;
        }

        console.log('⏹️ Stopped watching for structure changes');
        this.isWatching = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Manually trigger a structure update check
     */
    async forceCheck() {
        console.log('🔍 Manual structure check triggered');
        return await this.checkForChanges();
    }
}

// Global instance
window.StructureUpdater = StructureUpdater;

// Auto-start when page loads (optional)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof window.structureUpdater === 'undefined') {
            window.structureUpdater = new StructureUpdater();
            // Uncomment the next line to auto-start watching
            // window.structureUpdater.startWatching();
        }
    });
} else {
    if (typeof window.structureUpdater === 'undefined') {
        window.structureUpdater = new StructureUpdater();
        // Uncomment the next line to auto-start watching
        // window.structureUpdater.startWatching();
    }
}