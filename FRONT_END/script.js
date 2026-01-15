// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Header Scroll Effect
// ===================================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===================================
// Active Navigation Link
// ===================================
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
        font-weight: 600;
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ===================================
// Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.mission-card, .pilier-card, .why-card, .testimonial-card, .stat-item'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// Counter Animation for Stats
// ===================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString() + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.dataset.animated) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    statNumber.dataset.animated = 'true';
                    statNumber.textContent = '0+';
                    animateCounter(statNumber, number);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
});

// ===================================
// Form Validation (if forms are added later)
// ===================================
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// ===================================
// Lazy Loading Images (if images are added)
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// User Profile Menu
// ===================================
function initUserProfile() {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const profileToggle = document.getElementById('profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn && loginBtn && userProfile) {
        loginBtn.style.display = 'none';
        userProfile.style.display = 'block';
    }

    // Toggle dropdown
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        // Fermer le dropdown en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }
}

// Initialiser le profil utilisateur au chargement
document.addEventListener('DOMContentLoaded', function() {
    initUserProfile();
    
    // Cacher le bouton "Se connecter" sur la page d'accueil si l'utilisateur est connecté
    const btnHeroConnect = document.getElementById('btn-hero-connect');
    if (btnHeroConnect) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            btnHeroConnect.style.display = 'none';
        } else {
            btnHeroConnect.style.display = 'inline-block';
        }
    }
});

// ===================================
// Go To Course Function
// ===================================
function goToCourse(courseUrl) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
        } else {
            window.location.href = 'login.html';
        }
    } else {
        // Rediriger vers la page de formation dans le dossier formation/
        window.location.href = courseUrl;
        
        // Ajouter la formation au dashboard
        const courseName = document.querySelector('[onclick*="' + courseUrl + '"]')?.closest('.formation-card')?.querySelector('h3')?.textContent || 'Formation';
        addCourseToDashboard(courseName, courseUrl);
    }
}

// Add course to dashboard
function addCourseToDashboard(courseName, courseUrl) {
    let startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
    const courseExists = startedCourses.find(c => c.url === courseUrl);
    
    if (!courseExists) {
        startedCourses.push({
            name: courseName,
            url: courseUrl,
            progress: 0,
            startDate: new Date().toISOString()
        });
        localStorage.setItem('startedCourses', JSON.stringify(startedCourses));
        
        // Add notification
        let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift({
            id: Date.now(),
            message: `Vous avez commencé la formation "${courseName}"`,
            type: 'formation',
            link: courseUrl,
            date: new Date().toISOString(),
            read: false
        });
        notifications = notifications.slice(0, 50);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
}

// ===================================
// Add to History Function
// ===================================
function addToHistory(title, url, type, description) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;
    
    let history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
    
    // Vérifier si l'élément existe déjà
    const existingIndex = history.findIndex(item => item.url === url);
    
    if (existingIndex !== -1) {
        // Mettre à jour le timestamp
        history[existingIndex].timestamp = new Date().toISOString();
    } else {
        // Ajouter un nouvel élément
        history.unshift({
            title: title,
            url: url,
            type: type,
            description: description || '',
            timestamp: new Date().toISOString()
        });
    }
    
    // Limiter à 100 éléments
    history = history.slice(0, 100);
    
    localStorage.setItem('navigationHistory', JSON.stringify(history));
}

// ===================================
// Read Article Function
// ===================================
function readArticle(button) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
        } else {
            window.location.href = 'login.html';
        }
    } else {
        // Récupérer le titre de l'article depuis le bouton
        const articleCard = button.closest('.article-card');
        const articleTitle = articleCard.querySelector('h3').textContent;
        const articleDescription = articleCard.querySelector('p')?.textContent || '';
        
        // Créer un nom de fichier à partir du titre
        const articleSlug = articleTitle.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        // Rediriger vers la page d'article dans le dossier article/
        const articleFiles = {
            'les-10-meilleures-pratiques-de-cybersecurite-pour-les-pme-senegalaises': 'article-1-meilleures-pratiques-pme.html',
            'comment-demarrer-une-carriere-en-cybersecurite-au-senegal': 'article-2-carriere-cybersecurite.html',
            'les-nouvelles-menaces-cybernetiques-en-2024': 'article-3-menaces-cybernetiques-2024.html',
            'protection-des-donnees-personnelles-au-senegal-guide-pratique': 'article-4-protection-donnees-senegal.html',
            'securiser-son-reseau-wi-fi-guide-etape-par-etape': 'article-5-securiser-wifi.html',
            'etude-de-cas-comment-une-pme-senegalaise-a-renforce-sa-securite': 'article-6-etude-cas-pme.html',
            'les-tendances-de-la-cybersecurite-en-afrique-de-louest-en-2024': 'article-7-tendances-afrique-ouest.html',
            'certifications-en-cybersecurite-lesquelles-choisir': 'article-8-certifications-cybersecurite.html',
            'phishing-et-arnaques-en-ligne-comment-sen-proteger': 'article-9-phishing-arnaque-ligne.html',
            'chiffrement-des-donnees-bases-et-bonnes-pratiques': 'article-10-chiffrement-donnees.html',
            'les-competences-essentielles-dun-expert-en-cybersecurite': 'article-11-competences-expert-cybersecurite.html',
            'cybersecurite-et-transformation-digitale-au-senegal': 'article-12-cybersecurite-transformation-digitale.html'
        };
        
        const articleFile = articleFiles[articleSlug] || 'article-1-meilleures-pratiques-pme.html';
        const articleUrl = 'article/' + articleFile;
        
        // Ajouter à l'historique
        addToHistory(articleTitle, articleUrl, 'article', articleDescription);
        
        window.location.href = articleUrl;
    }
}

// ===================================
// Scroll to Top Button
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%cTERANGA SECURITY', 'color: #3b82f6; font-size: 24px; font-weight: bold;');
console.log('%cFormer et protéger les jeunes Sénégalais à l\'ère du numérique', 'color: #666; font-size: 14px;');
