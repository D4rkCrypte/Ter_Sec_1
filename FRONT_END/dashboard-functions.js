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
        startedCourses[courseIndex].progress = progress;
        localStorage.setItem('startedCourses', JSON.stringify(startedCourses));
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

// Initialize theme and language on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('language') || 'fr';
    changeTheme(savedTheme);
    changeLanguage(savedLang);
    
    // Rotate motivational message every 5 minutes
    setInterval(rotateMotivationalMessage, 5 * 60 * 1000);
});
