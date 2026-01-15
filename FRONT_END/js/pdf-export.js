// ===================================
// PDF Export System for Certificates
// ===================================

class PDFExport {
    constructor() {
        this.init();
    }

    init() {
        // Setup export buttons
        document.querySelectorAll('[data-export-pdf]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const certificateId = button.getAttribute('data-export-pdf');
                this.exportCertificate(certificateId);
            });
        });
    }

    async exportCertificate(certificateId) {
        try {
            // Show loading state
            if (typeof window.toast !== 'undefined') {
                window.toast.info('Génération du certificat en cours...');
            }

            // Get certificate data
            const certificateData = this.getCertificateData(certificateId);
            
            // Create certificate HTML
            const certificateHTML = this.generateCertificateHTML(certificateData);
            
            // Use html2pdf library if available, otherwise use print
            if (typeof html2pdf !== 'undefined') {
                await this.exportWithHtml2Pdf(certificateHTML, certificateData);
            } else {
                // Fallback: open print dialog
                this.exportWithPrint(certificateHTML, certificateData);
            }
        } catch (error) {
            console.error('Error exporting certificate:', error);
            if (typeof window.toast !== 'undefined') {
                window.toast.error('Erreur lors de l\'export du certificat');
            }
        }
    }

    getCertificateData(certificateId) {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userName = userData.name || 'Utilisateur';
        
        // Get certificate info (in real app, this would come from API)
        const certificates = {
            'cours-introduction-cybersecurite': {
                title: 'Introduction à la Cybersécurité',
                date: new Date().toLocaleDateString('fr-FR'),
                number: 'TS-' + Date.now()
            },
            'cours-securite-reseaux': {
                title: 'Sécurité des Réseaux',
                date: new Date().toLocaleDateString('fr-FR'),
                number: 'TS-' + Date.now()
            }
            // Add more certificates as needed
        };

        return {
            userName: userName,
            certificateTitle: certificates[certificateId]?.title || 'Certificat de Formation',
            issueDate: certificates[certificateId]?.date || new Date().toLocaleDateString('fr-FR'),
            certificateNumber: certificates[certificateId]?.number || 'TS-' + Date.now()
        };
    }

    generateCertificateHTML(data) {
        return `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Certificat - ${data.certificateTitle}</title>
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Inter', sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .certificate {
                        width: 297mm;
                        height: 210mm;
                        background: white;
                        padding: 40px;
                        box-sizing: border-box;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .certificate-header {
                        text-align: center;
                        margin-bottom: 40px;
                    }
                    .certificate-logo {
                        font-size: 32px;
                        font-weight: 800;
                        color: #3b82f6;
                        margin-bottom: 10px;
                    }
                    .certificate-title {
                        font-size: 48px;
                        font-weight: 700;
                        color: #1f2937;
                        margin-bottom: 60px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    .certificate-body {
                        text-align: center;
                        margin-bottom: 40px;
                    }
                    .certificate-text {
                        font-size: 20px;
                        color: #4b5563;
                        line-height: 1.8;
                        margin-bottom: 30px;
                    }
                    .certificate-name {
                        font-size: 36px;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 30px 0;
                        padding: 20px;
                        border-bottom: 3px solid #3b82f6;
                        display: inline-block;
                    }
                    .certificate-course {
                        font-size: 24px;
                        color: #3b82f6;
                        font-weight: 600;
                        margin: 20px 0;
                    }
                    .certificate-footer {
                        margin-top: 60px;
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        font-size: 14px;
                        color: #6b7280;
                    }
                    .certificate-number {
                        font-weight: 600;
                        color: #1f2937;
                    }
                    .certificate-date {
                        font-weight: 600;
                        color: #1f2937;
                    }
                    .certificate-seal {
                        position: absolute;
                        bottom: 40px;
                        right: 40px;
                        width: 100px;
                        height: 100px;
                        border: 4px solid #3b82f6;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: #3b82f6;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="certificate-header">
                        <div class="certificate-logo">TERANGA SECURITY</div>
                    </div>
                    <div class="certificate-title">Certificat de Formation</div>
                    <div class="certificate-body">
                        <div class="certificate-text">
                            Ceci certifie que
                        </div>
                        <div class="certificate-name">${data.userName}</div>
                        <div class="certificate-text">
                            a complété avec succès la formation
                        </div>
                        <div class="certificate-course">${data.certificateTitle}</div>
                    </div>
                    <div class="certificate-footer">
                        <div class="certificate-number">N° ${data.certificateNumber}</div>
                        <div class="certificate-date">Date: ${data.issueDate}</div>
                    </div>
                    <div class="certificate-seal">
                        TERANGA<br>SECURITY
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    async exportWithHtml2Pdf(html, data) {
        const opt = {
            margin: 0,
            filename: `certificat-${data.certificateTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        const element = document.createElement('div');
        element.innerHTML = html;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);

        await html2pdf().set(opt).from(element).save();

        document.body.removeChild(element);

        if (typeof window.toast !== 'undefined') {
            window.toast.success('Certificat téléchargé avec succès !');
        }
    }

    exportWithPrint(html, data) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 250);

        if (typeof window.toast !== 'undefined') {
            window.toast.info('Utilisez la fonction d\'impression de votre navigateur pour sauvegarder en PDF');
        }
    }
}

// Create global instance
const pdfExport = new PDFExport();

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.pdfExport = pdfExport;
}
