# Vérifier le Déploiement Netlify

## ✅ Vérification Rapide

### Étape 1 : Accéder à votre projet Netlify

Allez sur : [https://app.netlify.com/projects/ter-sec-1/overview](https://app.netlify.com/projects/ter-sec-1/overview)

### Étape 2 : Vérifier l'onglet "Deploys"

1. Cliquez sur l'onglet **"Deploys"** dans le menu de gauche
2. Vous devriez voir une liste des déploiements
3. Le dernier déploiement devrait être :
   - **État** : ✅ "Published" (vert) ou 🔄 "Building" (en cours)
   - **Commit** : "Ajout du README principal..." ou "Initial commit..."
   - **Date** : Il y a quelques minutes

### Étape 3 : Vérifier l'état du déploiement

- ✅ **"Published"** (vert) = Le site est en ligne et à jour
- 🔄 **"Building"** (jaune) = Le déploiement est en cours (attendez 1-2 minutes)
- ❌ **"Failed"** (rouge) = Il y a eu une erreur (voir les logs)

## 🔍 Si le déploiement n'a pas eu lieu automatiquement

### Problème : Aucun nouveau déploiement après le push GitHub

**Solution : Connecter Netlify à GitHub**

1. Dans Netlify, allez dans **"Site settings"**
2. Cliquez sur **"Build & deploy"** dans le menu de gauche
3. Dans la section **"Continuous Deployment"**, vérifiez :
   - Si vous voyez "Link repository" → Cliquez dessus
   - Si vous voyez déjà un dépôt lié → Vérifiez qu'il s'agit de `D4rkCrypte/Ter_Sec_1`

4. **Si vous devez connecter le dépôt** :
   - Cliquez sur **"Link repository"**
   - Sélectionnez **GitHub**
   - Autorisez Netlify à accéder à votre compte GitHub
   - Choisissez le dépôt : `D4rkCrypte/Ter_Sec_1`
   - Configurez :
     - **Branch to deploy** : `main`
     - **Build command** : (laissez vide)
     - **Publish directory** : `FRONT_END`
   - Cliquez sur **"Deploy site"**

### Problème : Le déploiement a échoué

1. Cliquez sur le déploiement qui a échoué
2. Regardez les **"Deploy logs"** pour voir l'erreur
3. Erreurs courantes :
   - **"Publish directory not found"** → Vérifiez que `FRONT_END` est correct
   - **"Build command failed"** → Vérifiez qu'il n'y a pas de commande de build configurée (laissez vide)
   - **"File not found"** → Vérifiez que tous les fichiers sont bien dans le dépôt GitHub

## 🚀 Déclencher un déploiement manuel

Si vous voulez forcer un nouveau déploiement :

1. Dans Netlify, allez dans **"Deploys"**
2. Cliquez sur **"Trigger deploy"** → **"Deploy site"**
3. Ou allez dans **"Site settings"** → **"Build & deploy"** → **"Trigger deploy"**

## 📋 Vérifier la configuration

Assurez-vous que la configuration est correcte :

1. **Site settings** → **"Build & deploy"** → **"Build settings"**
   - Build command : (vide)
   - Publish directory : `FRONT_END`

2. **Site settings** → **"Build & deploy"** → **"Continuous Deployment"**
   - Repository : `D4rkCrypte/Ter_Sec_1`
   - Branch : `main`
   - Status : ✅ Connected

## 🌐 Vérifier que le site est en ligne

Une fois le déploiement terminé :

1. Dans l'onglet **"Overview"** de Netlify
2. Vous verrez l'URL de votre site (ex: `ter-sec-1.netlify.app`)
3. Cliquez sur l'URL pour ouvrir votre site
4. Vérifiez que les modifications sont présentes (notamment le chat widget corrigé)

## 🔔 Notifications

Netlify peut vous envoyer des notifications par email :
- Quand un déploiement réussit
- Quand un déploiement échoue
- Quand un déploiement est en cours

Configurez-les dans : **"Site settings"** → **"Notifications"**

---

**Note** : Le déploiement automatique peut prendre 1-3 minutes après un push sur GitHub.
