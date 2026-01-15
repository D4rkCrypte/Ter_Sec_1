# Guide de Déploiement - GitHub et Netlify

Ce guide vous explique comment connecter votre projet TERANGA SECURITY à GitHub et le déployer automatiquement sur Netlify.

## 📋 Prérequis

- Un compte GitHub (gratuit) : [github.com](https://github.com)
- Un compte Netlify (gratuit) : [netlify.com](https://netlify.com)
- Git installé sur votre ordinateur

## 🚀 Étape 1 : Initialiser Git dans votre projet

Ouvrez PowerShell ou Terminal dans le dossier de votre projet et exécutez :

```bash
# Initialiser le dépôt Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Projet TERANGA SECURITY"
```

## 📤 Étape 2 : Créer un dépôt sur GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite, puis **"New repository"**
3. Remplissez les informations :
   - **Repository name** : `teranga-security` (ou le nom de votre choix)
   - **Description** : "Plateforme sénégalaise de formation en cybersécurité"
   - **Visibilité** : Public ou Private (selon votre préférence)
   - ⚠️ **NE COCHEZ PAS** "Initialize this repository with a README" (vous avez déjà des fichiers)
4. Cliquez sur **"Create repository"**

## 🔗 Étape 3 : Connecter votre projet local à GitHub

GitHub vous affichera des commandes. Utilisez celles pour "push an existing repository" :

```bash
# Ajouter le dépôt distant (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/teranga-security.git

# Renommer la branche principale en 'main' (si nécessaire)
git branch -M main

# Envoyer votre code sur GitHub
git push -u origin main
```

**Note** : GitHub vous demandera peut-être de vous authentifier. Utilisez un Personal Access Token si nécessaire.

## 🌐 Étape 4 : Déployer sur Netlify

### Option A : Déploiement automatique depuis GitHub (Recommandé)

1. Allez sur [app.netlify.com](https://app.netlify.com) et connectez-vous
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez **"GitHub"** comme fournisseur
4. Autorisez Netlify à accéder à votre compte GitHub
5. Sélectionnez votre dépôt `teranga-security`
6. Configurez les paramètres de build :
   - **Build command** : (laissez vide, car c'est un site statique)
   - **Publish directory** : `FRONT_END`
7. Cliquez sur **"Deploy site"**

Netlify va :
- Cloner votre dépôt GitHub
- Déployer votre site
- Vous donner une URL (ex: `teranga-security-123.netlify.app`)

### Option B : Déploiement manuel (Drag & Drop)

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Glissez-déposez le dossier `FRONT_END` dans la zone de déploiement
3. Votre site sera déployé immédiatement

## 🔄 Étape 5 : Déploiement automatique (CI/CD)

Avec l'Option A, chaque fois que vous poussez du code sur GitHub :

```bash
# Faire des modifications dans votre projet
# ...

# Ajouter les changements
git add .

# Créer un commit
git commit -m "Description de vos modifications"

# Envoyer sur GitHub
git push
```

Netlify détectera automatiquement les changements et redéploiera votre site ! 🎉

## ⚙️ Configuration personnalisée

Le fichier `netlify.toml` que nous avons créé configure :
- Le dossier de publication (`FRONT_END`)
- Les redirections
- Les en-têtes de sécurité
- La mise en cache des fichiers statiques

## 🌍 Personnaliser votre domaine

1. Dans Netlify, allez dans **"Site settings"** → **"Domain management"**
2. Cliquez sur **"Add custom domain"**
3. Suivez les instructions pour configurer votre domaine

## 📝 Commandes Git utiles

```bash
# Voir l'état des fichiers
git status

# Voir l'historique des commits
git log

# Créer une nouvelle branche
git checkout -b nom-de-la-branche

# Revenir à la branche principale
git checkout main

# Fusionner une branche
git merge nom-de-la-branche
```

## 🆘 Résolution de problèmes

### Erreur : "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/teranga-security.git
```

### Erreur d'authentification GitHub
Créez un Personal Access Token :
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Générer un nouveau token avec les permissions `repo`
3. Utilisez ce token comme mot de passe lors du `git push`

### Le site ne se met pas à jour sur Netlify
1. Vérifiez que le build a réussi dans l'onglet "Deploys" de Netlify
2. Vérifiez que le dossier `FRONT_END` est bien configuré comme "Publish directory"
3. Vérifiez les logs de build pour voir les erreurs

## ✅ Checklist

- [ ] Git initialisé dans le projet
- [ ] Dépôt créé sur GitHub
- [ ] Code poussé sur GitHub
- [ ] Site déployé sur Netlify
- [ ] Déploiement automatique configuré
- [ ] Site accessible et fonctionnel

---

**Félicitations !** Votre projet TERANGA SECURITY est maintenant connecté à GitHub et déployé sur Netlify ! 🎊
