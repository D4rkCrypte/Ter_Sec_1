// ===================================
// Système de Badges (Achievements)
// ===================================

class BadgesSystem {
    constructor() {
        this.badges = this.initializeBadges();
        this.init();
    }

    initializeBadges() {
        return [
            {
                id: 'first-steps',
                name: 'Premiers Pas',
                description: 'Complétez votre premier module',
                icon: '🎯',
                color: '#3b82f6',
                condition: (stats) => stats.completedModules >= 1,
                unlocked: false
            },
            {
                id: 'dedicated-learner',
                name: 'Apprenant Dédié',
                description: 'Complétez 5 modules',
                icon: '📚',
                color: '#10b981',
                condition: (stats) => stats.completedModules >= 5,
                unlocked: false
            },
            {
                id: 'course-master',
                name: 'Maître du Cours',
                description: 'Complétez un cours entier',
                icon: '🏆',
                color: '#f59e0b',
                condition: (stats) => stats.completedCourses >= 1,
                unlocked: false
            },
            {
                id: 'time-investor',
                name: 'Investisseur en Temps',
                description: 'Passez 10 heures sur la plateforme',
                icon: '⏰',
                color: '#8b5cf6',
                condition: (stats) => stats.totalTimeSpent >= 36000, // 10 heures en secondes
                unlocked: false
            },
            {
                id: 'week-warrior',
                name: 'Guerrier de la Semaine',
                description: 'Connectez-vous 7 jours consécutifs',
                icon: '🔥',
                color: '#ef4444',
                condition: (stats) => stats.consecutiveDays >= 7,
                unlocked: false
            },
            {
                id: 'speed-learner',
                name: 'Apprenant Rapide',
                description: 'Complétez 3 modules en une journée',
                icon: '⚡',
                color: '#fbbf24',
                condition: (stats) => stats.modulesToday >= 3,
                unlocked: false
            },
            {
                id: 'explorer',
                name: 'Explorateur',
                description: 'Visitez 10 modules différents',
                icon: '🗺️',
                color: '#06b6d4',
                condition: (stats) => stats.visitedModules >= 10,
                unlocked: false
            },
            {
                id: 'perfectionist',
                name: 'Perfectionniste',
                description: 'Obtenez 100% de progression sur un cours',
                icon: '💎',
                color: '#ec4899',
                condition: (stats) => stats.perfectCourses >= 1,
                unlocked: false
            },
            {
                id: 'early-bird',
                name: 'Lève-tôt',
                description: 'Connectez-vous avant 8h du matin',
                icon: '🌅',
                color: '#f97316',
                condition: (stats) => stats.earlyLogins >= 1,
                unlocked: false
            },
            {
                id: 'night-owl',
                name: 'Oiseau de Nuit',
                description: 'Connectez-vous après 22h',
                icon: '🦉',
                color: '#6366f1',
                condition: (stats) => stats.lateLogins >= 1,
                unlocked: false
            },
            {
                id: 'social-learner',
                name: 'Apprenant Social',
                description: 'Partagez 5 formations',
                icon: '📤',
                color: '#14b8a6',
                condition: (stats) => stats.sharedCourses >= 5,
                unlocked: false
            },
            {
                id: 'certified-expert',
                name: 'Expert Certifié',
                description: 'Obtenez 3 certificats',
                icon: '🎓',
                color: '#dc2626',
                condition: (stats) => stats.certificates >= 3,
                unlocked: false
            }
        ];
    }

    init() {
        this.loadBadges();
        this.checkBadges();
    }

    loadBadges() {
        const saved = localStorage.getItem('unlockedBadges');
        if (saved) {
            const unlockedIds = JSON.parse(saved);
            this.badges.forEach(badge => {
                badge.unlocked = unlockedIds.includes(badge.id);
            });
        }
    }

    saveBadges() {
        const unlockedIds = this.badges
            .filter(b => b.unlocked)
            .map(b => b.id);
        localStorage.setItem('unlockedBadges', JSON.stringify(unlockedIds));
    }

    getStats() {
        const startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
        const completedModules = startedCourses.reduce((sum, course) => 
            sum + (course.completedModules?.length || 0), 0);
        const completedCourses = startedCourses.filter(c => c.progress >= 100).length;
        const totalTimeSpent = startedCourses.reduce((sum, course) => 
            sum + (course.timeSpent || 0), 0);
        const visitedModules = startedCourses.reduce((sum, course) => 
            sum + (course.visitedModules?.length || 0), 0);
        const perfectCourses = startedCourses.filter(c => c.progress === 100).length;
        
        // Calculer les jours consécutifs
        const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        const consecutiveDays = this.calculateConsecutiveDays(loginHistory);
        
        // Modules complétés aujourd'hui
        const today = new Date().toDateString();
        const modulesToday = startedCourses.reduce((sum, course) => {
            const todayCompletions = (course.completedModules || []).filter(module => {
                // Simplifié - en production, stocker les dates de complétion
                return true; // Pour l'instant, on compte tous
            }).length;
            return sum + todayCompletions;
        }, 0);

        // Early/late logins
        const currentHour = new Date().getHours();
        const earlyLogins = currentHour < 8 ? 1 : 0;
        const lateLogins = currentHour >= 22 ? 1 : 0;

        // Shared courses
        const sharedCourses = parseInt(localStorage.getItem('sharedCourses') || '0');

        // Certificates
        const certificates = parseInt(localStorage.getItem('certificates') || '0');

        return {
            completedModules,
            completedCourses,
            totalTimeSpent,
            visitedModules,
            perfectCourses,
            consecutiveDays,
            modulesToday,
            earlyLogins,
            lateLogins,
            sharedCourses,
            certificates
        };
    }

    calculateConsecutiveDays(loginHistory) {
        if (loginHistory.length === 0) return 0;
        
        const sorted = loginHistory
            .map(date => new Date(date).toDateString())
            .sort()
            .filter((date, index, arr) => arr.indexOf(date) === index);
        
        let consecutive = 1;
        for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1]);
            const curr = new Date(sorted[i]);
            const diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                consecutive++;
            } else {
                break;
            }
        }
        return consecutive;
    }

    checkBadges() {
        const stats = this.getStats();
        let newBadges = [];

        this.badges.forEach(badge => {
            if (!badge.unlocked && badge.condition(stats)) {
                badge.unlocked = true;
                newBadges.push(badge);
            }
        });

        if (newBadges.length > 0) {
            this.saveBadges();
            this.showBadgeNotification(newBadges);
            window.dispatchEvent(new CustomEvent('badgesUnlocked', { detail: newBadges }));
        }
    }

    showBadgeNotification(badges) {
        badges.forEach((badge, index) => {
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.className = 'badge-notification';
                notification.style.cssText = `
                    position: fixed;
                    top: ${80 + index * 120}px;
                    right: 20px;
                    background: linear-gradient(135deg, ${badge.color} 0%, ${this.darkenColor(badge.color)} 100%);
                    color: white;
                    padding: 1.5rem 2rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    animation: badgeSlideIn 0.5s ease;
                    max-width: 350px;
                `;
                notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="font-size: 3rem;">${badge.icon}</div>
                        <div style="flex: 1;">
                            <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 0.25rem;">Nouveau badge débloqué !</div>
                            <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">${badge.name}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">${badge.description}</div>
                        </div>
                    </div>
                `;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.style.animation = 'badgeSlideOut 0.5s ease';
                    setTimeout(() => notification.remove(), 500);
                }, 5000);
            }, index * 200);
        });

        // Add CSS animations if not already added
        if (!document.getElementById('badge-animations')) {
            const style = document.createElement('style');
            style.id = 'badge-animations';
            style.textContent = `
                @keyframes badgeSlideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes badgeSlideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    darkenColor(color) {
        // Simple darkening - in production, use a proper color manipulation library
        return color;
    }

    getUnlockedBadges() {
        return this.badges.filter(b => b.unlocked);
    }

    getAllBadges() {
        return this.badges;
    }
}

// Initialize badges system
let badgesSystem;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        badgesSystem = new BadgesSystem();
    });
} else {
    badgesSystem = new BadgesSystem();
}

// Export for use in other scripts
window.BadgesSystem = BadgesSystem;
window.badgesSystem = badgesSystem;
