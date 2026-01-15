// ===================================
// Global Search System
// ===================================

class GlobalSearch {
    constructor() {
        this.searchInput = null;
        this.suggestionsContainer = null;
        this.searchData = [];
        this.debounceTimer = null;
        this.init();
    }

    async init() {
        // Get search input
        this.searchInput = document.getElementById('global-search-input');
        this.suggestionsContainer = document.getElementById('search-suggestions');

        if (!this.searchInput) return;

        // Load search data
        await this.loadSearchData();

        // Setup event listeners
        this.setupEventListeners();
    }

    async loadSearchData() {
        // In a real app, this would come from an API
        // For now, we'll extract data from the DOM or use static data
        
        // Formations data (would be loaded from formations.html or API)
        this.searchData = [
            // Formations
            { type: 'formation', title: 'Introduction à la Cybersécurité', url: 'formation/cours-introduction-cybersecurite.html', category: 'Débutant' },
            { type: 'formation', title: 'Sécurité des Réseaux', url: 'formation/cours-securite-reseaux.html', category: 'Intermédiaire' },
            { type: 'formation', title: 'Ethical Hacking & Penetration Testing', url: 'formation/cours-ethical-hacking.html', category: 'Avancé' },
            { type: 'formation', title: 'Gestion des Identités et Accès', url: 'formation/cours-gestion-identites.html', category: 'Intermédiaire' },
            { type: 'formation', title: 'Sécurité Mobile', url: 'formation/cours-securite-mobile.html', category: 'Débutant' },
            { type: 'formation', title: 'Sécurité Cloud', url: 'formation/cours-securite-cloud.html', category: 'Intermédiaire' },
            { type: 'formation', title: 'Détection et Prévention du Phishing', url: 'formation/cours-phishing.html', category: 'Débutant' },
            { type: 'formation', title: 'Sécurité Web et Applications', url: 'formation/cours-securite-web.html', category: 'Intermédiaire' },
            { type: 'formation', title: 'Sensibilisation à la Cybersécurité', url: 'formation/cours-sensibilisation.html', category: 'Débutant' },
            
            // Articles
            { type: 'article', title: 'Les 10 meilleures pratiques de cybersécurité pour les PME sénégalaises', url: 'article/article-1-meilleures-pratiques-pme.html', category: 'Sécurité' },
            { type: 'article', title: 'Comment démarrer une carrière en cybersécurité au Sénégal', url: 'article/article-2-carriere-cybersecurite.html', category: 'Formation' },
            { type: 'article', title: 'Les nouvelles menaces cybernétiques en 2024', url: 'article/article-3-menaces-cybernetiques-2024.html', category: 'Actualité' },
            { type: 'article', title: 'Protection des données personnelles au Sénégal', url: 'article/article-4-protection-donnees-senegal.html', category: 'Sécurité' },
            { type: 'article', title: 'Sécuriser son réseau Wi-Fi', url: 'article/article-5-securiser-wifi.html', category: 'Technique' },
            { type: 'article', title: 'Étude de cas : Comment une PME sénégalaise a renforcé sa sécurité', url: 'article/article-6-etude-cas-pme.html', category: 'Cas d\'étude' },
            { type: 'article', title: 'Les tendances de la cybersécurité en Afrique de l\'Ouest', url: 'article/article-7-tendances-afrique-ouest.html', category: 'Actualité' },
            { type: 'article', title: 'Certifications en cybersécurité : lesquelles choisir ?', url: 'article/article-8-certifications-cybersecurite.html', category: 'Formation' },
            { type: 'article', title: 'Phishing et arnaques en ligne : comment s\'en protéger', url: 'article/article-9-phishing-arnaque-ligne.html', category: 'Sécurité' },
            { type: 'article', title: 'Chiffrement des données : bases et bonnes pratiques', url: 'article/article-10-chiffrement-donnees.html', category: 'Technique' },
            { type: 'article', title: 'Les compétences essentielles d\'un expert en cybersécurité', url: 'article/article-11-competences-expert-cybersecurite.html', category: 'Formation' },
            { type: 'article', title: 'Cybersécurité et transformation digitale au Sénégal', url: 'article/article-12-cybersecurite-transformation-digitale.html', category: 'Actualité' }
        ];
    }

    setupEventListeners() {
        // Search input events
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value) {
                this.showSuggestions(this.searchInput.value);
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && 
                !this.suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });

        // Handle Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.searchInput.value);
            } else if (e.key === 'Escape') {
                this.hideSuggestions();
                this.searchInput.blur();
            }
        });
    }

    handleSearch(query) {
        // Debounce search
        clearTimeout(this.debounceTimer);
        
        if (!query || query.length < 2) {
            this.hideSuggestions();
            return;
        }

        this.debounceTimer = setTimeout(() => {
            this.showSuggestions(query);
        }, 300);
    }

    showSuggestions(query) {
        const results = this.search(query, 5);
        
        if (results.length === 0) {
            this.suggestionsContainer.innerHTML = `
                <div class="search-suggestion-empty">
                    <p>Aucun résultat trouvé pour "${query}"</p>
                </div>
            `;
        } else {
            this.suggestionsContainer.innerHTML = results.map(result => `
                <a href="${result.url}" class="search-suggestion-item">
                    <div class="suggestion-icon">
                        ${result.type === 'formation' ? 
                            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>' :
                            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>'
                        }
                    </div>
                    <div class="suggestion-content">
                        <div class="suggestion-title">${this.highlightText(result.title, query)}</div>
                        <div class="suggestion-meta">
                            <span class="suggestion-type">${result.type === 'formation' ? 'Formation' : 'Article'}</span>
                            ${result.category ? `<span class="suggestion-category">${result.category}</span>` : ''}
                        </div>
                    </div>
                </a>
            `).join('');
        }

        this.suggestionsContainer.classList.add('active');
    }

    hideSuggestions() {
        this.suggestionsContainer.classList.remove('active');
    }

    search(query, limit = 10) {
        const lowerQuery = query.toLowerCase();
        const results = this.searchData.filter(item => {
            return item.title.toLowerCase().includes(lowerQuery) ||
                   item.category?.toLowerCase().includes(lowerQuery);
        });

        // Sort by relevance (exact match first, then partial)
        results.sort((a, b) => {
            const aExact = a.title.toLowerCase().startsWith(lowerQuery);
            const bExact = b.title.toLowerCase().startsWith(lowerQuery);
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return 0;
        });

        return results.slice(0, limit);
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    performSearch(query) {
        if (!query || query.length < 2) return;
        
        // Redirect to search results page
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GlobalSearch();
    });
} else {
    new GlobalSearch();
}
