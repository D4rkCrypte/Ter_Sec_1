// ===================================
// Chat/Support Widget
// ===================================

class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEventListeners();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.id = 'chat-widget';
        widget.className = 'chat-widget';
        widget.innerHTML = `
            <button class="chat-toggle" id="chat-toggle" aria-label="Ouvrir le chat de support" aria-expanded="false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="chat-badge" id="chat-badge" style="display: none;">1</span>
            </button>
            <div class="chat-container" id="chat-container">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <h3>Support TERANGA SECURITY</h3>
                        <p class="chat-status">
                            <span class="status-indicator"></span>
                            En ligne
                        </p>
                    </div>
                    <button class="chat-close" id="chat-close" aria-label="Fermer le chat">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <div class="chat-message bot">
                        <div class="message-content">
                            <p>Bonjour ! 👋<br>Comment puis-je vous aider aujourd'hui ?</p>
                        </div>
                        <div class="message-time">Maintenant</div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <form class="chat-form" id="chat-form">
                        <input 
                            type="text" 
                            id="chat-input" 
                            placeholder="Tapez votre message..." 
                            autocomplete="off"
                            aria-label="Message de chat"
                        >
                        <button type="submit" class="chat-send" aria-label="Envoyer le message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                    <div class="chat-hours">
                        <small>Disponible du lundi au vendredi, 9h - 18h (GMT)</small>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
    }

    setupEventListeners() {
        const toggle = document.getElementById('chat-toggle');
        const close = document.getElementById('chat-close');
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');

        toggle.addEventListener('click', () => {
            this.toggle();
        });

        close.addEventListener('click', () => {
            this.close();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage(input.value);
            input.value = '';
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chat-container');
        const toggle = document.getElementById('chat-toggle');
        
        if (this.isOpen) {
            container.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            document.getElementById('chat-input').focus();
            // Empêcher le scroll du body sur mobile quand le chat est ouvert
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            container.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            // Restaurer le scroll du body
            document.body.style.overflow = '';
        }
    }

    close() {
        this.isOpen = false;
        const container = document.getElementById('chat-container');
        const toggle = document.getElementById('chat-toggle');
        container.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        // Restaurer le scroll du body
        document.body.style.overflow = '';
    }

    sendMessage(message) {
        if (!message.trim()) return;

        // Add user message
        this.addMessage(message, 'user');

        // Simulate bot response (in real app, this would be an API call)
        setTimeout(() => {
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        const now = new Date();
        const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(text)}</p>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    }

    getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Simple keyword matching (in real app, use AI/NLP)
        if (lowerMessage.includes('formation') || lowerMessage.includes('cours')) {
            return 'Nous proposons plusieurs formations en cybersécurité adaptées au contexte sénégalais. Vous pouvez consulter notre page <a href="/formations.html">Formations</a> pour plus d\'informations.';
        } else if (lowerMessage.includes('inscription') || lowerMessage.includes('compte')) {
            return 'Pour créer un compte, rendez-vous sur notre page <a href="/inscription.html">Inscription</a>. C\'est gratuit et rapide !';
        } else if (lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('tarif')) {
            return 'Nos formations sont actuellement gratuites. Nous croyons en l\'accessibilité de la formation en cybersécurité pour tous les Sénégalais.';
        } else if (lowerMessage.includes('certificat')) {
            return 'Oui, tous nos cours incluent un certificat de complétion que vous pouvez télécharger en format PDF une fois la formation terminée.';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            return 'Vous pouvez nous contacter par email à contact@terangasecurity.com ou utiliser notre <a href="/contact.html">formulaire de contact</a>.';
        } else {
            return 'Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais. En attendant, vous pouvez consulter nos <a href="/articles.html">articles</a> ou nos <a href="/formations.html">formations</a>.';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showBadge(count = 1) {
        const badge = document.getElementById('chat-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    hideBadge() {
        this.showBadge(0);
    }
}

// Initialize chat widget when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ChatWidget();
    });
} else {
    new ChatWidget();
}
