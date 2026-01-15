// ===================================
// Favorites/Bookmarks System
// ===================================

class FavoritesSystem {
    constructor() {
        this.storageKey = 'teranga_favorites';
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        // Update all favorite buttons on page load
        this.updateAllFavoriteButtons();
        
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.favorites = this.loadFavorites();
                this.updateAllFavoriteButtons();
            }
        });
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : { formations: [], articles: [] };
        } catch (e) {
            console.error('Error loading favorites:', e);
            return { formations: [], articles: [] };
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: this.favorites }));
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }

    isFavorite(type, id) {
        return this.favorites[type]?.includes(id) || false;
    }

    toggleFavorite(type, id) {
        if (!this.favorites[type]) {
            this.favorites[type] = [];
        }

        const index = this.favorites[type].indexOf(id);
        
        if (index > -1) {
            // Remove from favorites
            this.favorites[type].splice(index, 1);
            this.saveFavorites();
            this.updateFavoriteButton(type, id, false);
            
            if (typeof window.toast !== 'undefined') {
                window.toast.info('Retiré des favoris');
            }
            return false;
        } else {
            // Add to favorites
            this.favorites[type].push(id);
            this.saveFavorites();
            this.updateFavoriteButton(type, id, true);
            
            if (typeof window.toast !== 'undefined') {
                window.toast.success('Ajouté aux favoris');
            }
            return true;
        }
    }

    getFavorites(type) {
        return this.favorites[type] || [];
    }

    getFavoriteCount() {
        return (this.favorites.formations?.length || 0) + (this.favorites.articles?.length || 0);
    }

    updateFavoriteButton(type, id, isFavorite) {
        const button = document.querySelector(`[data-favorite-type="${type}"][data-favorite-id="${id}"]`);
        if (button) {
            if (isFavorite) {
                button.classList.add('favorited');
                button.setAttribute('aria-pressed', 'true');
                const icon = button.querySelector('.favorite-icon');
                if (icon) {
                    icon.innerHTML = this.getFavoriteIcon(true);
                }
            } else {
                button.classList.remove('favorited');
                button.setAttribute('aria-pressed', 'false');
                const icon = button.querySelector('.favorite-icon');
                if (icon) {
                    icon.innerHTML = this.getFavoriteIcon(false);
                }
            }
        }
    }

    updateAllFavoriteButtons() {
        // Update formation favorite buttons
        document.querySelectorAll('[data-favorite-type="formations"]').forEach(button => {
            const id = button.getAttribute('data-favorite-id');
            const isFavorite = this.isFavorite('formations', id);
            this.updateFavoriteButton('formations', id, isFavorite);
        });

        // Update article favorite buttons
        document.querySelectorAll('[data-favorite-type="articles"]').forEach(button => {
            const id = button.getAttribute('data-favorite-id');
            const isFavorite = this.isFavorite('articles', id);
            this.updateFavoriteButton('articles', id, isFavorite);
        });

        // Update favorite count in header if exists
        this.updateFavoriteCount();
    }

    updateFavoriteCount() {
        const countElement = document.getElementById('favorite-count');
        if (countElement) {
            const count = this.getFavoriteCount();
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }

    getFavoriteIcon(filled) {
        if (filled) {
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>`;
        } else {
            return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>`;
        }
    }

    createFavoriteButton(type, id, title = '') {
        const button = document.createElement('button');
        button.className = 'btn-favorite';
        button.setAttribute('data-favorite-type', type);
        button.setAttribute('data-favorite-id', id);
        button.setAttribute('aria-label', `Ajouter ${title} aux favoris`);
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = `
            <span class="favorite-icon">${this.getFavoriteIcon(false)}</span>
        `;
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isFavorite = this.toggleFavorite(type, id);
            button.setAttribute('aria-label', isFavorite ? `Retirer ${title} des favoris` : `Ajouter ${title} aux favoris`);
        });

        // Set initial state
        const isFavorite = this.isFavorite(type, id);
        this.updateFavoriteButton(type, id, isFavorite);

        return button;
    }
}

// Create global instance
const favoritesSystem = new FavoritesSystem();

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.favoritesSystem = favoritesSystem;
}
