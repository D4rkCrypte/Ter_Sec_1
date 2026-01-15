# Configuration Netlify pour TERANGA SECURITY

## ✅ État actuel

- **GitHub Repository** : [https://github.com/D4rkCrypte/Ter_Sec_1](https://github.com/D4rkCrypte/Ter_Sec_1)
- **Netlify Project** : [https://app.netlify.com/projects/ter-sec-1/overview](https://app.netlify.com/projects/ter-sec-1/overview)

## 🔄 Mise à jour automatique sur Netlify

Si votre projet Netlify est déjà connecté à GitHub, le déploiement se fera automatiquement après chaque `git push`.

### Vérifier la connexion GitHub-Netlify

1. Allez sur [https://app.netlify.com/projects/ter-sec-1/overview](https://app.netlify.com/projects/ter-sec-1/overview)
2. Cliquez sur **"Site settings"** (Paramètres du site)
3. Allez dans **"Build & deploy"** → **"Continuous Deployment"**
4. Vérifiez que le dépôt GitHub est connecté

### Si le dépôt n'est pas connecté

1. Dans Netlify, allez dans **"Site settings"** → **"Build & deploy"**
2. Cliquez sur **"Link repository"** ou **"Connect to Git provider"**
3. Sélectionnez **GitHub** et autorisez l'accès
4. Choisissez le dépôt `D4rkCrypte/Ter_Sec_1`
5. Configurez les paramètres de build :
   - **Build command** : (laissez vide - site statique)
   - **Publish directory** : `FRONT_END`
6. Cliquez sur **"Deploy site"**

## 📋 Configuration actuelle

Le fichier `netlify.toml` est déjà configuré avec :
- **Publish directory** : `FRONT_END`
- Redirections pour les pages HTML
- Headers de sécurité
- Cache pour les fichiers statiques

## 🚀 Déploiement manuel (si nécessaire)

Si vous devez déployer manuellement :

1. Allez sur [https://app.netlify.com/projects/ter-sec-1/overview](https://app.netlify.com/projects/ter-sec-1/overview)
2. Cliquez sur **"Deploys"**
3. Glissez-déposez le dossier `FRONT_END` dans la zone de déploiement

## 🔍 Vérifier le déploiement

Après un push sur GitHub, vous pouvez :

1. Vérifier l'onglet **"Deploys"** dans Netlify
2. Voir les logs de build pour détecter d'éventuelles erreurs
3. Visiter votre site une fois le déploiement terminé

## 📝 Commandes Git pour mettre à jour

```bash
# Faire des modifications
git add .
git commit -m "Description des modifications"
git push
```

Netlify détectera automatiquement les changements et redéploiera le site ! 🎉

---

**Note** : Le déploiement peut prendre quelques minutes. Vous recevrez une notification une fois terminé.
