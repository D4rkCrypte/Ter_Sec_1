// ===================================
// Statistiques Améliorées pour le Dashboard
// ===================================

class EnhancedStatistics {
    constructor() {
        this.init();
    }

    init() {
        this.updateAllStatistics();
        this.setupRealTimeUpdates();
    }

    updateAllStatistics() {
        const stats = this.calculateStatistics();
        this.displayStatistics(stats);
        this.createCharts(stats);
    }

    calculateStatistics() {
        const startedCourses = JSON.parse(localStorage.getItem('startedCourses') || '[]');
        const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        const unlockedBadges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');

        // Statistiques de base
        const totalCourses = startedCourses.length;
        const completedCourses = startedCourses.filter(c => c.progress >= 100).length;
        const inProgressCourses = startedCourses.filter(c => c.progress > 0 && c.progress < 100).length;
        
        // Progression moyenne
        const averageProgress = totalCourses > 0 
            ? Math.round(startedCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / totalCourses)
            : 0;

        // Temps total
        const totalTimeSpent = startedCourses.reduce((sum, c) => sum + (c.timeSpent || 0), 0);
        const hoursSpent = Math.floor(totalTimeSpent / 3600);
        const minutesSpent = Math.floor((totalTimeSpent % 3600) / 60);

        // Modules
        const totalModules = startedCourses.reduce((sum, c) => sum + (c.completedModules?.length || 0), 0);
        const visitedModules = startedCourses.reduce((sum, c) => sum + (c.visitedModules?.length || 0), 0);

        // Dates
        const firstCourseDate = startedCourses.length > 0 
            ? new Date(startedCourses[0].startDate) 
            : null;
        const daysSinceStart = firstCourseDate 
            ? Math.floor((Date.now() - firstCourseDate.getTime()) / (1000 * 60 * 60 * 24))
            : 0;

        // Tendances
        const coursesThisWeek = this.getCoursesThisWeek(startedCourses);
        const modulesThisWeek = this.getModulesThisWeek(startedCourses);
        const timeThisWeek = this.getTimeThisWeek(startedCourses);

        // Badges
        const badgesCount = unlockedBadges.length;
        const totalBadges = 12; // Nombre total de badges disponibles

        // Streak (jours consécutifs)
        const currentStreak = this.calculateStreak(loginHistory);
        const longestStreak = this.calculateLongestStreak(loginHistory);

        // Performance par cours
        const coursePerformance = startedCourses.map(course => ({
            name: course.name,
            progress: course.progress || 0,
            timeSpent: course.timeSpent || 0,
            modulesCompleted: course.completedModules?.length || 0,
            startDate: course.startDate
        }));

        return {
            totalCourses,
            completedCourses,
            inProgressCourses,
            averageProgress,
            totalTimeSpent,
            hoursSpent,
            minutesSpent,
            totalModules,
            visitedModules,
            daysSinceStart,
            coursesThisWeek,
            modulesThisWeek,
            timeThisWeek,
            badgesCount,
            totalBadges,
            currentStreak,
            longestStreak,
            coursePerformance
        };
    }

    getCoursesThisWeek(courses) {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return courses.filter(c => new Date(c.startDate).getTime() > weekAgo).length;
    }

    getModulesThisWeek(courses) {
        // Simplifié - en production, stocker les dates de complétion
        return courses.reduce((sum, c) => sum + (c.completedModules?.length || 0), 0);
    }

    getTimeThisWeek(courses) {
        // Simplifié - en production, calculer le temps de cette semaine
        return courses.reduce((sum, c) => sum + (c.timeSpent || 0), 0);
    }

    calculateStreak(loginHistory) {
        if (loginHistory.length === 0) return 0;
        
        const today = new Date().toDateString();
        const sorted = loginHistory
            .map(date => new Date(date).toDateString())
            .sort()
            .reverse()
            .filter((date, index, arr) => arr.indexOf(date) === index);
        
        if (sorted[0] !== today && sorted[0] !== new Date(Date.now() - 86400000).toDateString()) {
            return 0; // Pas connecté aujourd'hui ou hier
        }

        let streak = 1;
        for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1]);
            const curr = new Date(sorted[i]);
            const diffDays = Math.floor((prev - curr) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    calculateLongestStreak(loginHistory) {
        if (loginHistory.length === 0) return 0;
        
        const sorted = loginHistory
            .map(date => new Date(date).toDateString())
            .sort()
            .filter((date, index, arr) => arr.indexOf(date) === index);
        
        let longestStreak = 1;
        let currentStreak = 1;
        
        for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1]);
            const curr = new Date(sorted[i]);
            const diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        return longestStreak;
    }

    displayStatistics(stats) {
        // Mettre à jour les éléments de statistiques dans la page
        const elements = {
            'stat-total-courses': stats.totalCourses,
            'stat-completed-courses': stats.completedCourses,
            'stat-in-progress': stats.inProgressCourses,
            'stat-average-progress': stats.averageProgress + '%',
            'stat-total-time': `${stats.hoursSpent}h ${stats.minutesSpent}m`,
            'stat-total-modules': stats.totalModules,
            'stat-badges': `${stats.badgesCount}/${stats.totalBadges}`,
            'stat-streak': stats.currentStreak,
            'stat-longest-streak': stats.longestStreak
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    createCharts(stats) {
        // Créer des graphiques de progression
        this.createProgressChart(stats.coursePerformance);
        this.createTimeChart(stats);
        this.createBadgesChart(stats);
    }

    createProgressChart(coursePerformance) {
        const container = document.getElementById('progress-chart-container');
        if (!container) return;

        // Créer un graphique simple avec des barres
        container.innerHTML = coursePerformance.map(course => `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600;">${course.name}</span>
                    <span style="color: #3b82f6; font-weight: 600;">${course.progress}%</span>
                </div>
                <div style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); width: ${course.progress}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `).join('');
    }

    createTimeChart(stats) {
        const container = document.getElementById('time-chart-container');
        if (!container) return;

        // Graphique de temps par jour de la semaine (simplifié)
        container.innerHTML = `
            <div style="display: flex; align-items: flex-end; gap: 0.5rem; height: 200px;">
                ${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                    const height = Math.random() * 100; // En production, utiliser les vraies données
                    return `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 100%; background: linear-gradient(180deg, #3b82f6, #2563eb); height: ${height}%; border-radius: 4px 4px 0 0; margin-bottom: 0.5rem;"></div>
                            <span style="font-size: 0.75rem; color: #6b7280;">${day}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    createBadgesChart(stats) {
        const container = document.getElementById('badges-chart-container');
        if (!container) return;

        const percentage = Math.round((stats.badgesCount / stats.totalBadges) * 100);
        container.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                <div style="font-size: 2rem; font-weight: 700; color: #3b82f6; margin-bottom: 0.5rem;">${stats.badgesCount}/${stats.totalBadges}</div>
                <div style="font-size: 0.9rem; color: #6b7280; margin-bottom: 1rem;">Badges débloqués</div>
                <div style="height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden;">
                    <div style="height: 100%; background: linear-gradient(90deg, #f59e0b, #d97706); width: ${percentage}%; transition: width 0.3s ease;"></div>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #6b7280;">${percentage}% complété</div>
            </div>
        `;
    }

    setupRealTimeUpdates() {
        // Mettre à jour les statistiques toutes les 30 secondes
        setInterval(() => {
            this.updateAllStatistics();
        }, 30000);

        // Écouter les événements de mise à jour
        window.addEventListener('progressUpdated', () => {
            this.updateAllStatistics();
        });

        window.addEventListener('badgesUnlocked', () => {
            this.updateAllStatistics();
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.enhancedStatistics = new EnhancedStatistics();
    });
} else {
    window.enhancedStatistics = new EnhancedStatistics();
}
