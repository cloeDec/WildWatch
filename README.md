# WildWatch 🦝

Une application mobile React Native pour observer et cataloguer la faune et la flore sauvage.

## 📱 Fonctionnalités

### 🗺️ Carte Interactive
- Carte Mapbox avec géolocalisation
- Affichage de votre position actuelle
- Pins personnalisés pour les observations
- Navigation tactile complète

### 📸 Observations
- **Création** : Ajoutez de nouvelles observations en cliquant sur la carte
- **Modification** : Éditez vos observations existantes
- **Suppression** : Supprimez les observations non désirées
- **Photos** : Ajoutez des photos depuis une galerie simulée ou la caméra

### 🖼️ Gestion des Photos
- Sélecteur d'images intégré avec aperçus
- Images simulées pour les tests
- Support caméra et galerie
- Affichage circulaire élégant

## 🛠️ Technologies

- **React Native** avec Expo
- **TypeScript** pour la sécurité des types
- **Mapbox** pour les cartes interactives
- **Expo Router** pour la navigation
- **Store global** pour la gestion d'état
- **React Native Date Picker** pour les dates

## 🚀 Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd WildWatch

# Installer les dépendances
npm install

# Lancer l'application
npx expo start
```

## ⚙️ Configuration

### Mapbox
1. Créez un compte sur [Mapbox](https://mapbox.com)
2. Créez un fichier `.env` à la racine :
```env
EXPO_PUBLIC_MAPBOX_TOKEN=votre_token_mapbox
```

## 📁 Structure du Projet

```
WildWatch/
├── app/
│   └── observationModal.tsx    # Modal d'observation
├── components/
│   └── MapScreen.tsx           # Composant carte principal
├── hooks/
│   └── useObservationsStore.ts # Hook de gestion des observations
├── store/
│   └── observationsStore.ts    # Store global
├── types/
│   └── observation.ts          # Types TypeScript
├── assets/
│   └── images/                 # Images de test
└── config/
    └── env.ts                  # Configuration environnement
```

## 🎯 Utilisation

### Créer une Observation
1. Ouvrez l'application
2. Cliquez n'importe où sur la carte
3. Remplissez le formulaire (nom de l'espèce)
4. Ajoutez une photo (optionnel)
5. Sélectionnez la date
6. Enregistrez

### Modifier une Observation
1. Cliquez sur un pin existant sur la carte
2. Modifiez les informations
3. Enregistrez les changements

### Supprimer une Observation
1. Cliquez sur un pin existant
2. Cliquez sur "Supprimer"
3. Confirmez la suppression

## 🐛 Debug

L'application inclut de nombreux logs de debug dans la console pour faciliter le développement :

```javascript
console.log('MapScreen: Nombre d\'observations:', observations.length);
console.log('ObservationModal: isEditing =', isEditing);
```

## 📸 Images de Test

L'application inclut des images de test pour simuler la fonctionnalité photo :
- Raton laveur
- Fleurs diverses
- Photos de nature

## 🔄 État de l'Application

L'application utilise un store global qui persiste les observations entre les sessions et synchronise automatiquement tous les composants.

## 🚧 Développement

### Hooks Disponibles
- `useObservationsStore()` - Gestion des observations
- `useFocusEffect()` - Rechargement lors du focus

### Fonctions Principales
- `createNewObservation()` - Créer une observation
- `updateObservation()` - Modifier une observation
- `deleteObservation()` - Supprimer une observation

## 📝 TODO
- [ ] Persistence en base de données
- [ ] Synchronisation cloud
- [ ] Filtres et recherche
- [ ] Export des données
- [ ] Mode hors-ligne

---

Développé avec ❤️ pour les amoureux de la nature
