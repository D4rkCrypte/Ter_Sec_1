// ===================================
// Filters System for Formations and Articles
// ===================================

class FiltersSystem {
    constructor(containerId, itemsSelector) {
        this.container = document.getElementById(containerId);
        this.items = document.querySelectorAll(itemsSelector);
        this.activeFilters = {
            category: 'all',
            level: 'all',
            duration: 'all',
            date: 'all'
        };
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Setup filter buttons
        this.setupFilterButtons();
        
        // Load saved filters from localStorage
        this.loadSavedFilters();
        
        // Apply initial filters
        this.applyFilters();
    }

    setupFilterButtons() {
        // Category filters
        const categoryFilters = this.container.querySelectorAll('[data-filter-category]');
        categoryFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilters.category = btn.dataset.filterCategory;
                this.applyFilters();
                this.saveFilters();
            });
        });

        // Level filters (for formations)
        const levelFilters = this.container.querySelectorAll('[data-filter-level]');
        levelFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                levelFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilters.level = btn.dataset.filterLevel;
                this.applyFilters();
                this.saveFilters();
            });
        });

        // Duration filters (for formations)
        const durationFilters = this.container.querySelectorAll('[data-filter-duration]');
        durationFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                durationFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilters.duration = btn.dataset.filterDuration;
                this.applyFilters();
                this.saveFilters();
            });
        });

        // Date filters (for articles)
        const dateFilters = this.container.querySelectorAll('[data-filter-date]');
        dateFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                dateFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilters.date = btn.dataset.filterDate;
                this.applyFilters();
                this.saveFilters();
            });
        });

        // Sort options
        const sortSelect = this.container.querySelector('[data-sort]');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortItems(e.target.value);
            });
        }

        // Reset button
        const resetBtn = this.container.querySelector('[data-reset-filters]');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    applyFilters() {
        let visibleCount = 0;

        this.items.forEach(item => {
            let shouldShow = true;

            // Category filter
            if (this.activeFilters.category !== 'all') {
                const itemCategory = item.dataset.category || '';
                if (itemCategory !== this.activeFilters.category) {
                    shouldShow = false;
                }
            }

            // Level filter (formations)
            if (this.activeFilters.level !== 'all') {
                const itemLevel = item.dataset.level || '';
                if (itemLevel !== this.activeFilters.level) {
                    shouldShow = false;
                }
            }

            // Duration filter (formations)
            if (this.activeFilters.duration !== 'all') {
                const itemDuration = parseInt(item.dataset.duration) || 0;
                const [min, max] = this.parseDuration(this.activeFilters.duration);
                if (itemDuration < min || (max && itemDuration > max)) {
                    shouldShow = false;
                }
            }

            // Date filter (articles)
            if (this.activeFilters.date !== 'all') {
                const itemDate = new Date(item.dataset.date || 0);
                if (!this.isDateInRange(itemDate, this.activeFilters.date)) {
                    shouldShow = false;
                }
            }

            if (shouldShow) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Update results count
        this.updateResultsCount(visibleCount);
    }

    parseDuration(duration) {
        switch (duration) {
            case '1-5':
                return [1, 5];
            case '5-10':
                return [5, 10];
            case '10+':
                return [10, null];
            default:
                return [0, null];
        }
    }

    isDateInRange(date, range) {
        const now = new Date();
        const diffTime = now - date;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        switch (range) {
            case 'week':
                return diffDays <= 7;
            case 'month':
                return diffDays <= 30;
            case 'year':
                return diffDays <= 365;
            default:
                return true;
        }
    }

    sortItems(sortBy) {
        const container = this.items[0]?.parentElement;
        if (!container) return;

        const itemsArray = Array.from(this.items);
        
        itemsArray.sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return (a.dataset.name || '').localeCompare(b.dataset.name || '');
                case 'name-desc':
                    return (b.dataset.name || '').localeCompare(a.dataset.name || '');
                case 'date-desc':
                    return new Date(b.dataset.date || 0) - new Date(a.dataset.date || 0);
                case 'date-asc':
                    return new Date(a.dataset.date || 0) - new Date(b.dataset.date || 0);
                case 'popularity':
                    return (parseInt(b.dataset.popularity) || 0) - (parseInt(a.dataset.popularity) || 0);
                default:
                    return 0;
            }
        });

        // Re-append sorted items
        itemsArray.forEach(item => container.appendChild(item));
    }

    resetFilters() {
        this.activeFilters = {
            category: 'all',
            level: 'all',
            duration: 'all',
            date: 'all'
        };

        // Reset all filter buttons
        this.container.querySelectorAll('.filter-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });

        // Set 'all' buttons as active
        this.container.querySelectorAll('[data-filter-category="all"], [data-filter-level="all"], [data-filter-duration="all"], [data-filter-date="all"]').forEach(btn => {
            btn.classList.add('active');
        });

        // Reset sort
        const sortSelect = this.container.querySelector('[data-sort]');
        if (sortSelect) {
            sortSelect.value = 'popularity';
        }

        this.applyFilters();
        this.saveFilters();
    }

    updateResultsCount(count) {
        const countElement = this.container.querySelector('.results-count');
        if (countElement) {
            countElement.textContent = `${count} résultat${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
        }
    }

    saveFilters() {
        localStorage.setItem('filters_' + this.container.id, JSON.stringify(this.activeFilters));
    }

    loadSavedFilters() {
        const saved = localStorage.getItem('filters_' + this.container.id);
        if (saved) {
            try {
                this.activeFilters = { ...this.activeFilters, ...JSON.parse(saved) };
                
                // Update button states
                Object.keys(this.activeFilters).forEach(key => {
                    const btn = this.container.querySelector(`[data-filter-${key}="${this.activeFilters[key]}"]`);
                    if (btn) {
                        btn.classList.add('active');
                    }
                });
            } catch (e) {
                console.error('Error loading saved filters:', e);
            }
        }
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.FiltersSystem = FiltersSystem;
}
