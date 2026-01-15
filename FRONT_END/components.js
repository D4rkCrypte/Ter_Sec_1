// Fonction pour générer le header
function generateHeader() {
    return `
    <header class="header">
        <nav class="navbar">
            <div class="container">
                <div class="nav-wrapper">
                    <div class="logo">
                        <a href="index.html">TERANGA SECURITY</a>
                    </div>
                    <button class="mobile-menu-toggle" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-menu">
                        <li><a href="index.html" class="nav-link">Accueil</a></li>
                        <li><a href="a-propos.html" class="nav-link">À propos</a></li>
                        <li><a href="formations.html" class="nav-link">Formations</a></li>
                        <li><a href="articles.html" class="nav-link">Articles</a></li>
                        <li><a href="contact.html" class="nav-link">Contact</a></li>
                        <li><a href="login.html" class="nav-link btn-login">Se connecter</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    `;
}

// Fonction pour générer le footer
function generateFooter() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h3 class="footer-title">TERANGA SECURITY</h3>
                    <p class="footer-description">
                        Plateforme sénégalaise de formation et sensibilisation en cybersécurité.
                    </p>
                    <p class="footer-tagline">
                        Former, Protéger, Renforcer la sécurité numérique au Sénégal.
                    </p>
                </div>
                <div class="footer-col">
                    <h4 class="footer-subtitle">Liens Rapides</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">Accueil</a></li>
                        <li><a href="formations.html">Formations</a></li>
                        <li><a href="a-propos.html">À propos</a></li>
                        <li><a href="articles.html">Articles</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-subtitle">Contact</h4>
                    <ul class="footer-contact">
                        <li>📧 <a href="mailto:contact@terangasecurity.com">contact@terangasecurity.com</a></li>
                        <li>📱 <a href="tel:+221777777777">+221 77 777 77 77</a></li>
                        <li>📍 Dakar, Sénégal</li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-subtitle">Suivez-nous</h4>
                    <div class="social-links">
                        <a href="#" class="social-link" aria-label="Facebook">Facebook</a>
                        <a href="#" class="social-link" aria-label="Twitter">Twitter</a>
                        <a href="#" class="social-link" aria-label="LinkedIn">LinkedIn</a>
                        <a href="#" class="social-link" aria-label="Instagram">Instagram</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 TERANGA SECURITY. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
    `;
}
