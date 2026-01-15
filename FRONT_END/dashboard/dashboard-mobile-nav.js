// Dashboard Mobile Navigation Script
// This script handles mobile bottom navigation and sidebar toggle

(function() {
    'use strict';

    // Create mobile bottom navigation HTML
    function createMobileBottomNav() {
        const nav = document.createElement('nav');
        nav.className = 'mobile-bottom-nav';
        nav.id = 'mobile-bottom-nav';
        nav.innerHTML = `
            <a href="mes-formations.html" class="nav-item-mobile" data-page="formations">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Formations</span>
            </a>
            <a href="examens-quiz.html" class="nav-item-mobile" data-page="examens">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Quiz</span>
            </a>
            <a href="progression.html" class="nav-item-mobile" data-page="progression">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <span>Progression</span>
            </a>
            <a href="profil.html" class="nav-item-mobile" data-page="profil">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profil</span>
            </a>
        `;
        document.body.appendChild(nav);
    }

    // Create sidebar overlay
    function createSidebarOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    // Add mobile menu button to header
    function addMobileMenuButton() {
        const headerLeft = document.querySelector('.header-left');
        if (headerLeft && !document.getElementById('mobile-menu-toggle')) {
            const button = document.createElement('button');
            button.className = 'mobile-menu-btn';
            button.id = 'mobile-menu-toggle';
            button.setAttribute('aria-label', 'Toggle menu');
            button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            `;
            headerLeft.insertBefore(button, headerLeft.firstChild);
        }
    }

    // Set active nav item based on current page
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'mes-formations.html';
        const pageMap = {
            'mes-formations.html': 'formations',
            'examens-quiz.html': 'examens',
            'progression.html': 'progression',
            'certificats.html': 'certificats',
            'historique.html': 'formations',
            'profil.html': 'profil',
            'notifications.html': 'formations',
            'aide-support.html': 'formations'
        };
        
        const currentPageKey = pageMap[currentPage] || 'formations';
        const navItems = document.querySelectorAll('.nav-item-mobile');
        
        navItems.forEach(item => {
            const pageKey = item.getAttribute('data-page');
            if (pageKey === currentPageKey) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Check if device is mobile/tablet (not desktop)
    function isMobileDevice() {
        // Check for touch capability
        const hasTouchScreen = 'ontouchstart' in window || 
                               navigator.maxTouchPoints > 0 || 
                               navigator.msMaxTouchPoints > 0;
        
        // Check screen width (tablets and phones)
        const isSmallScreen = window.innerWidth <= 1024;
        
        // Check for pointer type (coarse = touch, fine = mouse)
        const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const hasNoHover = window.matchMedia('(hover: none)').matches;
        
        // Check user agent for mobile devices
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        
        // Return true only if it's a touch device with small screen OR mobile user agent
        return (hasTouchScreen && isSmallScreen && (hasCoarsePointer || hasNoHover)) || 
               (isMobileUA && isSmallScreen);
    }

    // Initialize mobile navigation
    function initMobileNav() {
        // Only initialize mobile nav on mobile/tablet devices
        if (!isMobileDevice()) {
            return; // Don't show mobile nav on desktop
        }
        
        // Only add mobile nav if it doesn't exist
        if (!document.getElementById('mobile-bottom-nav')) {
            createMobileBottomNav();
        }
        
        if (!document.getElementById('sidebar-overlay')) {
            createSidebarOverlay();
        }
        
        addMobileMenuButton();
        setActiveNavItem();

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        if (mobileMenuToggle && sidebar && sidebarOverlay) {
            mobileMenuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                sidebarOverlay.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            });

            sidebarOverlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close sidebar when clicking on a nav link (mobile)
        if (window.innerWidth <= 768) {
            const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (sidebar) sidebar.classList.remove('active');
                    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Close sidebar on resize
                if (sidebar) sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Show/hide mobile nav based on device type
                const mobileNav = document.getElementById('mobile-bottom-nav');
                if (mobileNav) {
                    if (isMobileDevice()) {
                        mobileNav.style.display = 'flex';
                        if (document.querySelector('.dashboard-main')) {
                            document.querySelector('.dashboard-main').style.paddingBottom = 'calc(80px + env(safe-area-inset-bottom))';
                        }
                    } else {
                        mobileNav.style.display = 'none';
                        if (document.querySelector('.dashboard-main')) {
                            document.querySelector('.dashboard-main').style.paddingBottom = '';
                        }
                    }
                }
            }, 250);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
})();
