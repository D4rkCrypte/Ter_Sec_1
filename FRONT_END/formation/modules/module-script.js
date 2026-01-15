// Script partagé pour tous les modules
(function() {
    // Auto-track progress
    if (typeof autoTrackProgress === 'function') {
        autoTrackProgress();
    }

    // Update progress bar on scroll
    function updateProgressOnScroll() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        const progressBar = document.getElementById('module-progress');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar && progressText) {
            const percent = Math.min(100, Math.max(0, Math.round(scrollPercent)));
            progressBar.style.width = percent + '%';
            progressText.textContent = percent + '%';
        }
    }

    window.addEventListener('scroll', updateProgressOnScroll);
    updateProgressOnScroll();

    // Complete module function
    window.completeModule = function(moduleNumber) {
        const courseUrl = '/formation/cours-introduction-cybersecurite.html';
        
        if (typeof completeModule === 'function' && window.completeModule !== completeModule) {
            // Use the function from dashboard-functions.js
            if (completeModule(courseUrl, moduleNumber)) {
                showCompletionMessage();
                const btn = document.getElementById('complete-btn');
                if (btn) {
                    btn.style.background = '#10b981';
                    btn.innerHTML = '✓ Complété';
                    btn.disabled = true;
                }
            }
        } else {
            // Fallback - use dashboard-functions directly
            if (typeof window.completeModule === 'function' && window.completeModule !== completeModule) {
                window.completeModule(courseUrl, moduleNumber);
            }
            showCompletionMessage();
        }
    };

    function showCompletionMessage() {
        // Create a nice notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 2rem;">🎉</div>
                <div>
                    <strong style="display: block; font-size: 1.1rem; margin-bottom: 0.25rem;">Module complété !</strong>
                    <span style="font-size: 0.9rem; opacity: 0.9;">Bravo, continuez ainsi !</span>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
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
})();
