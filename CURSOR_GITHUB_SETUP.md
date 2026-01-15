# Guide : Lier GitHub avec Cursor

Ce guide vous explique comment connecter votre compte GitHub à Cursor pour une meilleure intégration.

## 🔗 Méthode 1 : Authentification GitHub dans Cursor

### Étape 1 : Ouvrir les paramètres de Cursor

1. Dans Cursor, appuyez sur `Ctrl + ,` (ou `Cmd + ,` sur Mac) pour ouvrir les paramètres
2. Ou allez dans **File** → **Preferences** → **Settings**

### Étape 2 : Se connecter à GitHub

1. Dans la barre latérale de Cursor, cherchez l'icône **Source Control** (ou appuyez sur `Ctrl + Shift + G`)
2. Cliquez sur l'icône **...** (trois points) en haut
3. Sélectionnez **"Sign in with GitHub"** ou **"Connect to GitHub"**
4. Une fenêtre de navigateur s'ouvrira pour vous authentifier
5. Autorisez Cursor à accéder à votre compte GitHub

### Étape 3 : Vérifier la connexion

Une fois connecté, vous devriez voir :
- Votre nom d'utilisateur GitHub dans les paramètres
- La possibilité de push/pull directement depuis Cursor
- L'accès aux fonctionnalités GitHub intégrées

## 🔑 Méthode 2 : Configuration Git avec Personal Access Token

Si la méthode 1 ne fonctionne pas, vous pouvez utiliser un Personal Access Token :

### Étape 1 : Créer un Personal Access Token sur GitHub

1. Allez sur [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom au token (ex: "Cursor Access")
4. Sélectionnez les permissions :
   - ✅ `repo` (accès complet aux dépôts)
   - ✅ `workflow` (si vous utilisez GitHub Actions)
5. Cliquez sur **"Generate token"**
6. **⚠️ IMPORTANT** : Copiez le token immédiatement (vous ne pourrez plus le voir après)

### Étape 2 : Configurer Git avec le token

Dans Cursor, ouvrez le terminal intégré (`Ctrl + `` `) et exécutez :

```bash
# Configurer le credential helper pour stocker le token
git config --global credential.helper manager

# Pour Windows, vous pouvez aussi utiliser :
git config --global credential.helper wincred
```

### Étape 3 : Utiliser le token lors du push

Lors du prochain `git push`, Git vous demandera :
- **Username** : `D4rkCrypte`
- **Password** : Collez votre Personal Access Token (pas votre mot de passe GitHub)

## 🛠️ Méthode 3 : Configuration via Cursor Settings

1. Ouvrez les paramètres de Cursor (`Ctrl + ,`)
2. Cherchez "Git" dans la barre de recherche
3. Configurez :
   - **Git: Enabled** : ✅ Activé
   - **Git: Path** : (laisser par défaut ou spécifier le chemin vers git.exe)
   - **Git: Authentication** : GitHub

## ✅ Vérifier que tout fonctionne

Testez la connexion en faisant un push :

```bash
# Faire une petite modification
echo "# Test" >> test.md

# Ajouter et commiter
git add test.md
git commit -m "Test connexion GitHub-Cursor"
git push
```

Si le push fonctionne sans demander de credentials, la connexion est réussie !

## 🔍 Fonctionnalités disponibles après connexion

Une fois GitHub lié à Cursor, vous pouvez :

- ✅ **Push/Pull directement** depuis l'interface Cursor
- ✅ **Voir les branches** et changer de branche facilement
- ✅ **Créer des commits** avec l'interface graphique
- ✅ **Voir l'historique Git** dans Cursor
- ✅ **Résoudre les conflits** visuellement
- ✅ **Utiliser GitHub Copilot** (si vous avez un abonnement)

## 🐛 Résolution de problèmes

### Problème : "Authentication failed"

**Solution** :
1. Vérifiez que votre Personal Access Token est valide
2. Régénérez un nouveau token si nécessaire
3. Utilisez le token comme mot de passe (pas votre mot de passe GitHub)

### Problème : "Repository not found"

**Solution** :
1. Vérifiez que vous avez les droits d'accès au dépôt
2. Vérifiez l'URL du remote : `git remote -v`
3. Si nécessaire, mettez à jour : `git remote set-url origin https://github.com/D4rkCrypte/Ter_Sec_1.git`

### Problème : Cursor ne détecte pas Git

**Solution** :
1. Vérifiez que Git est installé : `git --version`
2. Dans Cursor Settings, vérifiez le chemin vers Git
3. Redémarrez Cursor

## 📝 Configuration actuelle de votre projet

Votre projet est déjà configuré avec :
- **Remote GitHub** : `https://github.com/D4rkCrypte/Ter_Sec_1.git`
- **Branche principale** : `main`
- **User Git** : `D4rkCrypte`

Il ne reste plus qu'à authentifier Cursor avec GitHub !

---

**Astuce** : Une fois connecté, vous pouvez utiliser le panneau Source Control de Cursor (icône dans la barre latérale) pour gérer Git visuellement sans utiliser le terminal.
