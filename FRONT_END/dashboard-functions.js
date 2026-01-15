// ===================================
// Dashboard Functions
// ===================================

// Add course to dashboard when started
function addCourseToDashboard(courseName, courseUrl) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;
    
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
        addNotification(`Vous avez commencé la formation "${courseName}"`, 'formation', courseUrl);
    }
}

// Add notification
function addNotification(message, type, link) {
    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift({
        id: Date.now(),
        message: message,
        type: type,
        link: link,
        date: new Date().toISOString(),
        read: false
    });
    // Keep only last 50 notifications
    notifications = notifications.slice(0, 50);
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Get started courses
function getStartedCourses() {
    return JSON.parse(localStorage.getItem('startedCourses') || '[]');
}

// Update course progress
function updateCourseProgress(courseUrl, progress) {
    let startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
    const courseIndex = startedCourses.findIndex(c => c.url === courseUrl);
    if (courseIndex !== -1) {
        startedCourses[courseIndex].progress = Math.min(100, Math.max(0, progress)); // Limiter entre 0 et 100
        startedCourses[courseIndex].lastAccess = new Date().toISOString();
        localStorage.setItem('startedCourses', JSON.stringify(startedCourses));
        
        // Déclencher un événement personnalisé pour mettre à jour l'affichage
        window.dispatchEvent(new CustomEvent('progressUpdated', {
            detail: { courseUrl, progress: startedCourses[courseIndex].progress }
        }));
    }
}

// Track module visit - Suivre la visite d'un module
function trackModuleVisit(courseUrl, moduleNumber) {
    let startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
    const courseIndex = startedCourses.findIndex(c => c.url === courseUrl);
    
    if (courseIndex !== -1) {
        const course = startedCourses[courseIndex];
        
        // Initialiser les propriétés si elles n'existent pas
        if (!course.completedModules) course.completedModules = [];
        if (!course.visitedModules) course.visitedModules = [];
        if (!course.timeSpent) course.timeSpent = 0;
        
        // Ajouter le module aux modules visités (sans doublon)
        if (!course.visitedModules.includes(moduleNumber)) {
            course.visitedModules.push(moduleNumber);
        }
        
        // Mettre à jour le module actuel
        course.currentModule = moduleNumber;
        course.lastAccess = new Date().toISOString();
        
        // Recalculer la progression basée sur les modules visités
        // Supposons 5 modules par cours (à adapter selon le nombre réel)
        const totalModules = 5;
        const progress = Math.round((course.visitedModules.length / totalModules) * 100);
        course.progress = Math.min(100, progress);
        
        localStorage.setItem('startedCourses', JSON.stringify(startedCourses));
        
        // Déclencher l'événement de mise à jour
        window.dispatchEvent(new CustomEvent('progressUpdated', {
            detail: { courseUrl, progress: course.progress }
        }));
    }
}

// Complete module - Marquer un module comme complété
function completeModule(courseUrl, moduleNumber) {
    let startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
    const courseIndex = startedCourses.findIndex(c => c.url === courseUrl);
    
    if (courseIndex !== -1) {
        const course = startedCourses[courseIndex];
        
        // Initialiser les propriétés si elles n'existent pas
        if (!course.completedModules) course.completedModules = [];
        if (!course.visitedModules) course.visitedModules = [];
        
        // Ajouter le module aux modules complétés (sans doublon)
        if (!course.completedModules.includes(moduleNumber)) {
            course.completedModules.push(moduleNumber);
            
            // Ajouter une notification
            addNotification(`Module ${moduleNumber} complété ! 🎉`, 'success', courseUrl);
        }
        
        // Recalculer la progression basée sur les modules complétés
        const totalModules = 5; // À adapter selon le nombre réel de modules
        const progress = Math.round((course.completedModules.length / totalModules) * 100);
        course.progress = Math.min(100, progress);
        course.lastAccess = new Date().toISOString();
        
        localStorage.setItem('startedCourses', JSON.stringify(startedCourses));
        
        // Déclencher l'événement de mise à jour
        window.dispatchEvent(new CustomEvent('progressUpdated', {
            detail: { courseUrl, progress: course.progress }
        }));
        
        return true;
    }
    return false;
}

// Get course progress - Récupérer la progression d'un cours
function getCourseProgress(courseUrl) {
    const startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
    const course = startedCourses.find(c => c.url === courseUrl);
    
    if (course) {
        return {
            progress: course.progress || 0,
            completedModules: course.completedModules || [],
            visitedModules: course.visitedModules || [],
            currentModule: course.currentModule || 1,
            startDate: course.startDate,
            lastAccess: course.lastAccess,
            timeSpent: course.timeSpent || 0
        };
    }
    return null;
}

// Calculate overall progress - Calculer la progression globale
function calculateOverallProgress() {
    const startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
    
    if (startedCourses.length === 0) {
        return {
            totalCourses: 0,
            averageProgress: 0,
            totalTimeSpent: 0,
            completedCourses: 0
        };
    }
    
    const totalProgress = startedCourses.reduce((sum, course) => sum + (course.progress || 0), 0);
    const averageProgress = Math.round(totalProgress / startedCourses.length);
    const totalTimeSpent = startedCourses.reduce((sum, course) => sum + (course.timeSpent || 0), 0);
    const completedCourses = startedCourses.filter(course => course.progress >= 100).length;
    
    return {
        totalCourses: startedCourses.length,
        averageProgress: averageProgress,
        totalTimeSpent: totalTimeSpent,
        completedCourses: completedCourses
    };
}

// Track time spent - Suivre le temps passé sur une page
let timeTrackingInterval = null;
let pageStartTime = null;

function startTimeTracking(courseUrl) {
    if (timeTrackingInterval) {
        clearInterval(timeTrackingInterval);
    }
    
    pageStartTime = Date.now();
    
    // Mettre à jour toutes les 30 secondes
    timeTrackingInterval = setInterval(() => {
        if (pageStartTime) {
            const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000); // en secondes
            
            let startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
            const courseIndex = startedCourses.findIndex(c => c.url === courseUrl);
            
            if (courseIndex !== -1) {
                startedCourses[courseIndex].timeSpent = (startedCourses[courseIndex].timeSpent || 0) + 30;
                localStorage.setItem('startedCourses', JSON.stringify(startedCourses));
                pageStartTime = Date.now(); // Réinitialiser pour le prochain intervalle
            }
        }
    }, 30000); // 30 secondes
}

function stopTimeTracking() {
    if (timeTrackingInterval) {
        clearInterval(timeTrackingInterval);
        timeTrackingInterval = null;
    }
    pageStartTime = null;
}

// Auto-detect course URL from current page - Détecter automatiquement l'URL du cours
function detectCourseUrl() {
    const currentPath = window.location.pathname;
    
    // Si on est sur une page de module, extraire l'URL du cours parent
    if (currentPath.includes('/modules/')) {
        // Extraire le nom du cours depuis le chemin
        const pathParts = currentPath.split('/');
        const moduleFile = pathParts[pathParts.length - 1];
        
        // Mapper les modules aux cours
        const moduleToCourse = {
            'module-1-introduction.html': '/formation/cours-introduction-cybersecurite.html',
            'module-2-menaces.html': '/formation/cours-introduction-cybersecurite.html',
            'module-3-vulnerabilites.html': '/formation/cours-introduction-cybersecurite.html',
            'module-4-bonnes-pratiques.html': '/formation/cours-introduction-cybersecurite.html',
            'module-5-certification.html': '/formation/cours-introduction-cybersecurite.html',
            // Ajouter d'autres mappings selon les besoins
        };
        
        // Chercher dans les patterns
        for (const [module, course] of Object.entries(moduleToCourse)) {
            if (moduleFile.includes(module.replace('.html', ''))) {
                return course;
            }
        }
        
        // Pattern générique : si le nom du module contient un nom de cours
        if (moduleFile.includes('introduction')) {
            return '/formation/cours-introduction-cybersecurite.html';
        } else if (moduleFile.includes('phishing')) {
            return '/formation/cours-phishing.html';
        } else if (moduleFile.includes('hacking')) {
            return '/formation/cours-ethical-hacking.html';
        } else if (moduleFile.includes('reseaux')) {
            return '/formation/cours-securite-reseaux.html';
        } else if (moduleFile.includes('web')) {
            return '/formation/cours-securite-web.html';
        } else if (moduleFile.includes('mobile')) {
            return '/formation/cours-securite-mobile.html';
        } else if (moduleFile.includes('cloud')) {
            return '/formation/cours-securite-cloud.html';
        } else if (moduleFile.includes('sensibilisation')) {
            return '/formation/cours-sensibilisation.html';
        } else if (moduleFile.includes('gestion-identites')) {
            return '/formation/cours-gestion-identites.html';
        }
    }
    
    // Si on est directement sur une page de cours
    if (currentPath.includes('/formation/cours-')) {
        return currentPath;
    }
    
    return null;
}

// Auto-track progress on page load - Suivi automatique au chargement de la page
function autoTrackProgress() {
    const courseUrl = detectCourseUrl();
    
    if (courseUrl) {
        // Extraire le numéro du module depuis l'URL
        const moduleMatch = window.location.pathname.match(/module-(\d+)/);
        const moduleNumber = moduleMatch ? parseInt(moduleMatch[1]) : 1;
        
        // Démarrer le suivi du temps
        startTimeTracking(courseUrl);
        
        // Enregistrer la visite du module
        trackModuleVisit(courseUrl, moduleNumber);
        
        // Arrêter le suivi quand on quitte la page
        window.addEventListener('beforeunload', stopTimeTracking);
        window.addEventListener('pagehide', stopTimeTracking);
    }
}

// Get motivational messages
const motivationalMessages = [
    "Continuez d'apprendre ! Chaque pas vous rapproche de l'expertise.",
    "La persévérance est la clé du succès. Vous progressez bien !",
    "Bravo pour votre engagement ! Votre apprentissage porte ses fruits.",
    "Vous êtes sur la bonne voie ! Continuez ainsi.",
    "L'excellence n'est pas une destination, c'est un voyage. Continuez !",
    "Chaque leçon apprise renforce votre expertise. Excellent travail !",
    "Votre détermination est impressionnante. Ne lâchez rien !",
    "La cybersécurité évolue, et vous aussi. Continuez à grandir !",
    "Chaque jour est une nouvelle chance de devenir meilleur qu'hier.",
    "Les grands succès commencent toujours par une petite décision.",
    "N'abandonne pas maintenant, tu es plus proche que tu ne le crois.",
    "Le travail d'aujourd'hui construit la réussite de demain.",
    "Même lentement, avancer reste toujours avancer.",
    "La discipline bat la motivation quand la motivation faiblit.",
    "Tes rêves méritent des efforts réels, pas des excuses.",
    "Tomber fait partie du chemin, se relever est un choix.",
    "Crois en toi même quand personne d'autre ne le fait.",
    "Le succès appartient à ceux qui osent persévérer.",
    "Chaque difficulté cache une opportunité de grandir.",
    "Ne regarde pas la distance, fais juste le prochain pas.",
    "Ton futur te remercie pour les efforts d'aujourd'hui.",
    "Les échecs forgent les esprits forts.",
    "Sois constant, même quand personne ne te regarde.",
    "Ce que tu fais chaque jour compte plus que ce que tu fais rarement.",
    "La peur disparaît quand l'action commence.",
    "Tu es capable de bien plus que tu ne l'imagines.",
    "Travaille en silence et laisse les résultats parler.",
    "Les limites existent d'abord dans la tête.",
    "Un jour difficile ne définit pas une vie entière.",
    "Le courage, c'est continuer malgré le doute.",
    "Chaque effort sincère te rapproche de ton objectif.",
    "Rien ne change si tu ne changes rien.",
    "Le succès aime la persévérance.",
    "Fais-le pour la personne que tu veux devenir.",
    "Les petites victoires créent les grandes réussites.",
    "Ta détermination est plus forte que tes excuses.",
    "N'attends pas d'être prêt, commence.",
    "La constance transforme les rêves en réalité.",
    "Tu n'as pas besoin d'être parfait pour avancer.",
    "Chaque pas compte, même les plus petits.",
    "Les efforts invisibles produisent des résultats visibles.",
    "Ne doute jamais de la puissance de ta volonté.",
    "Les obstacles sont là pour tester ta détermination.",
    "Ton engagement détermine ta destination.",
    "Apprends, adapte-toi et continue.",
    "La réussite commence par croire que c'est possible.",
    "Ce que tu refuses d'abandonner finit par réussir.",
    "Fais aujourd'hui ce que ton futur admirera.",
    "La patience et le travail ouvrent toutes les portes.",
    "Ta progression vaut plus que la perfection.",
    "Chaque matin est une opportunité de recommencer.",
    "Le succès est un voyage, pas une destination.",
    "N'arrête pas quand c'est dur, continue.",
    "Ton mindset façonne ton avenir.",
    "Les grandes choses prennent du temps.",
    "Reste concentré, reste déterminé.",
    "La persévérance transforme l'impossible en possible.",
    "Croire en soi est le premier pas vers la réussite."
];

let currentMotivationalIndex = 0;

function getCurrentMotivationalMessage() {
    return motivationalMessages[currentMotivationalIndex];
}

function rotateMotivationalMessage() {
    currentMotivationalIndex = (currentMotivationalIndex + 1) % motivationalMessages.length;
}

// Language translations
const translations = {
    fr: {
        dashboard: "Tableau de bord",
        myCourses: "Mes Formations",
        exams: "Examens & Quiz",
        progress: "Progression",
        profile: "Profil",
        settings: "Paramètres",
        logout: "Déconnexion",
        welcome: "Bienvenue",
        // ... add more translations
    },
    en: {
        dashboard: "Dashboard",
        myCourses: "My Courses",
        exams: "Exams & Quiz",
        progress: "Progress",
        profile: "Profile",
        settings: "Settings",
        logout: "Logout",
        welcome: "Welcome",
        // ... add more translations
    }
};

// Change language
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    // Update all text elements (simplified - would need more comprehensive implementation)
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// Change theme
function changeTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#0a1428';
        document.body.style.color = '#ffffff';
    } else {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#1a1a1a';
    }
}

// Track login history for streak calculation
function trackLogin() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        let loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Add today if not already present
        if (!loginHistory.includes(today)) {
            loginHistory.push(today);
            // Keep only last 90 days
            loginHistory = loginHistory.slice(-90);
            localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
        }
    }
}

// Initialize theme and language on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('language') || 'fr';
    changeTheme(savedTheme);
    changeLanguage(savedLang);
    
    // Track login
    trackLogin();
    
    // Rotate motivational message every 5 minutes
    setInterval(rotateMotivationalMessage, 5 * 60 * 1000);
});
