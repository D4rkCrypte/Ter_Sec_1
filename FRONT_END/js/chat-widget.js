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
                            <p>Bonjour ! 👋<br>Je suis l'assistant de TERANGA SECURITY. Je peux vous aider avec :<br><br>• Les formations disponibles<br>• L'inscription (c'est gratuit !)<br>• Les certificats<br>• Le support technique<br>• Les articles et ressources<br><br>Posez-moi votre question !</p>
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
        
        // Créer les éléments DOM pour éviter tout problème d'échappement
        const messageContentDiv = document.createElement('div');
        messageContentDiv.className = 'message-content';
        
        const paragraph = document.createElement('p');
        
        // Pour les messages du bot, on permet le HTML (liens), pour l'utilisateur on échappe
        if (type === 'bot') {
            paragraph.innerHTML = text; // Permet le rendu HTML pour les liens
        } else {
            paragraph.textContent = text; // Échappe automatiquement pour l'utilisateur
        }
        
        messageContentDiv.appendChild(paragraph);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = time;
        
        messageDiv.appendChild(messageContentDiv);
        messageDiv.appendChild(timeDiv);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Ajouter un léger délai pour l'animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
        }, 10);
    }

    // Normaliser le message pour une meilleure détection
    normalizeMessage(message) {
        const lowerMessage = message.toLowerCase().trim();
        // Remplacer les caractères spéciaux et normaliser les espaces
        let normalized = lowerMessage.replace(/[^\w\sàâäéèêëïîôöùûüÿç]/g, ' ').replace(/\s+/g, ' ');
        // Normaliser les variations courantes
        normalized = normalized.replace(/\b(c est|ces|se)\b/g, '');
        normalized = normalized.replace(/\b(comment|comme|combien|quel|quelle|quels|quelles)\b/g, '');
        return normalized;
    }

    getBotResponse(message) {
        const lowerMessage = message.toLowerCase().trim();
        const normalizedMessage = this.normalizeMessage(message);
        
        // Base de connaissances avec patterns et réponses
        const knowledgeBase = [
            // Formations et cours
            {
                patterns: ['formation', 'cours', 'apprendre', 'étudier', 'programme', 'curriculum', 'module'],
                questions: ['quelle formation', 'quelles formations', 'types de formation', 'formation disponible', 'cours disponible'],
                response: 'Nous proposons plusieurs formations en cybersécurité adaptées au contexte sénégalais :<br>• Introduction à la cybersécurité<br>• Sécurité web<br>• Sécurité réseau<br>• Ethical hacking<br>• Phishing et sensibilisation<br>• Sécurité mobile et cloud<br><br>Consultez notre page <a href="/formations.html">Formations</a> pour tous les détails.'
            },
            // Inscription et compte
            {
                patterns: ['inscription', 'inscrire', 'compte', 'créer un compte', 's\'inscrire', 'enregistrer', 'adhérer'],
                questions: ['comment s\'inscrire', 'comment créer', 'comment m\'inscrire', 'processus d\'inscription'],
                response: 'Pour créer un compte, c\'est simple et gratuit :<br>1. Rendez-vous sur notre page <a href="/inscription.html">Inscription</a><br>2. Remplissez le formulaire avec vos informations<br>3. Validez votre email<br>4. Commencez vos formations !<br><br>C\'est 100% gratuit et sans engagement.'
            },
            // Prix et coût
            {
                patterns: ['prix', 'coût', 'tarif', 'gratuit', 'payer', 'payant', 'abonnement', 'frais'],
                questions: ['combien ça coûte', 'c\'est gratuit', 'prix des formations', 'tarif', 'frais d\'inscription'],
                response: '✅ Toutes nos formations sont <strong>100% gratuites</strong> !<br><br>Nous croyons en l\'accessibilité de la formation en cybersécurité pour tous les Sénégalais. Aucun frais d\'inscription, aucun abonnement requis.'
            },
            // Certificat
            {
                patterns: ['certificat', 'diplôme', 'attestation', 'reconnaissance', 'certification', 'qualification'],
                questions: ['obtenir un certificat', 'certificat à la fin', 'diplôme', 'reconnaissance officielle'],
                response: 'Oui ! 🎓<br><br>Tous nos cours incluent un <strong>certificat de complétion</strong> que vous pouvez télécharger en format PDF une fois la formation terminée. Ce certificat atteste de vos compétences en cybersécurité.'
            },
            // Contact
            {
                patterns: ['contact', 'email', 'téléphone', 'adresse', 'joindre', 'contacter', 'écrire'],
                questions: ['comment vous contacter', 'votre email', 'votre adresse', 'coordonnées'],
                response: 'Vous pouvez nous contacter de plusieurs façons :<br>📧 Email : <a href="mailto:contact@terangasecurity.com">contact@terangasecurity.com</a><br>📱 Téléphone : +221 77 777 77 77<br>📍 Adresse : Dakar, Sénégal<br><br>Ou utilisez notre <a href="/contact.html">formulaire de contact</a> pour un message direct.'
            },
            // Durée et temps
            {
                patterns: ['durée', 'temps', 'combien de temps', 'long', 'rapide', 'heures', 'semaines', 'mois'],
                questions: ['durée d\'une formation', 'combien de temps', 'temps nécessaire'],
                response: 'La durée varie selon la formation :<br>• Formations courtes : 2-4 semaines<br>• Formations complètes : 6-12 semaines<br>• Vous pouvez apprendre à votre rythme<br>• Accès 24/7 aux contenus<br><br>Consultez chaque formation pour les détails précis.'
            },
            // Prérequis
            {
                patterns: ['prérequis', 'niveau', 'requis', 'nécessaire', 'débutant', 'expérience', 'connaissances'],
                questions: ['quels prérequis', 'niveau requis', 'débutant accepté', 'expérience nécessaire'],
                response: 'Nos formations sont accessibles à tous ! 🎯<br><br>• Pas de prérequis techniques obligatoires<br>• Certaines formations sont adaptées aux débutants<br>• D\'autres nécessitent des bases en informatique<br>• Chaque formation indique son niveau requis<br><br>Consultez les détails de chaque formation pour plus d\'informations.'
            },
            // Support et aide
            {
                patterns: ['aide', 'support', 'problème', 'difficulté', 'question', 'assistance', 'help'],
                questions: ['besoin d\'aide', 'avoir un problème', 'support technique'],
                response: 'Nous sommes là pour vous aider ! 💪<br><br>• Support disponible du lundi au vendredi, 9h-18h (GMT)<br>• Réponse sous 24h<br>• Forum communautaire pour échanger<br>• Documentation complète disponible<br><br>Contactez-nous via le <a href="/contact.html">formulaire</a> ou par email.'
            },
            // Articles et ressources
            {
                patterns: ['article', 'ressource', 'blog', 'actualité', 'nouvelle', 'conseil', 'astuce'],
                questions: ['lire des articles', 'ressources disponibles', 'blog'],
                response: 'Nous publions régulièrement des articles sur la cybersécurité :<br>• Actualités et tendances<br>• Conseils pratiques<br>• Études de cas<br>• Bonnes pratiques<br><br>Consultez nos <a href="/articles.html">articles</a> pour rester informé !'
            },
            // À propos
            {
                patterns: ['qui êtes-vous', 'à propos', 'mission', 'équipe', 'teranga security', 'présentation'],
                questions: ['qui êtes vous', 'votre mission', 'présentez vous'],
                response: 'TERANGA SECURITY est une plateforme sénégalaise de formation et sensibilisation en cybersécurité.<br><br>🎯 Notre mission : Former et protéger les jeunes Sénégalais à l\'ère du numérique.<br><br>Découvrez-en plus sur notre page <a href="/a-propos.html">À propos</a>.'
            },
            // Salutations
            {
                patterns: ['bonjour', 'salut', 'bonsoir', 'bonne journée', 'hello', 'hi'],
                questions: [],
                response: 'Bonjour ! 👋<br>Je suis là pour répondre à toutes vos questions sur TERANGA SECURITY. Comment puis-je vous aider ?'
            },
            // Remerciements
            {
                patterns: ['merci', 'remercier', 'gracie', 'thanks', 'thank you'],
                questions: [],
                response: 'De rien ! 😊<br>N\'hésitez pas si vous avez d\'autres questions. Bonne formation avec TERANGA SECURITY !'
            }
        ];

        // Système de scoring pour trouver la meilleure réponse
        let bestMatch = null;
        let bestScore = 0;

        // Détection spéciale pour les salutations simples (priorité haute)
        const salutationPatterns = ['bonjour', 'salut', 'bonsoir', 'hello', 'hi', 'bonne journée'];
        const isSalutation = salutationPatterns.some(pattern => lowerMessage === pattern || lowerMessage.startsWith(pattern + ' '));
        
        if (isSalutation) {
            const salutationItem = knowledgeBase.find(item => 
                item.patterns.some(p => salutationPatterns.includes(p))
            );
            if (salutationItem) {
                return salutationItem.response;
            }
        }

        for (const item of knowledgeBase) {
            let score = 0;
            
            // Vérifier les patterns simples (utiliser les deux versions du message)
            for (const pattern of item.patterns) {
                if (lowerMessage.includes(pattern) || normalizedMessage.includes(pattern)) {
                    score += 2;
                }
            }
            
            // Vérifier les questions précises (score plus élevé)
            for (const question of item.questions) {
                if (normalizedMessage.includes(question) || lowerMessage.includes(question)) {
                    score += 5;
                    break;
                }
            }
            
            // Si le message contient plusieurs mots-clés de la même catégorie
            const matchingPatterns = item.patterns.filter(p => 
                normalizedMessage.includes(p) || lowerMessage.includes(p)
            ).length;
            if (matchingPatterns > 1) {
                score += matchingPatterns;
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = item;
            }
        }

        // Si on a une bonne correspondance (score >= 2)
        if (bestMatch && bestScore >= 2) {
            return bestMatch.response;
        }

        // Réponse par défaut avec suggestions
        return 'Merci pour votre message ! 🤔<br><br>Je peux vous aider avec :<br>• Les formations disponibles<br>• L\'inscription et la création de compte<br>• Les certificats<br>• Les prix (c\'est gratuit !)<br>• Le contact et le support<br><br>Posez-moi une question plus précise ou consultez nos <a href="/formations.html">formations</a> et <a href="/articles.html">articles</a>.';
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
