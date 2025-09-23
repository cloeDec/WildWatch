# API et Hooks pour les Observations

Cette documentation explique comment utiliser l'API et les hooks créés pour gérer les observations dans l'application WildWatch.

## Structure des fichiers

```
api/
└── api.ts                 # Fonctions API pour les opérations CRUD
types/
└── observation.ts         # Interfaces TypeScript pour les observations
hooks/
├── useObservations.ts     # Hook pour gérer une liste d'observations
└── useObservation.ts      # Hook pour gérer une observation unique
components/
└── ObservationsListExample.tsx  # Exemple d'utilisation des hooks
```

## Types d'observation

```typescript
interface Observation {
  id: string;
  species: string;
  description?: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  photos?: string[];
  weather?: {
    temperature?: number;
    conditions?: string;
  };
  createdAt: number;
  updatedAt: number;
}
```

## Fonctions API disponibles

### `getObservations()`
Récupère toutes les observations
```typescript
const observations = await getObservations();
```

### `getObservation(id: string)`
Récupère une observation par son ID
```typescript
const observation = await getObservation('observation-id');
```

### `createObservation(observation: CreateObservationDto)`
Crée une nouvelle observation
```typescript
const newObservation = await createObservation({
  species: 'Renard roux',
  description: 'Observé près du ruisseau',
  latitude: 45.5017,
  longitude: -73.5673,
  accuracy: 5
});
```

### `updateObservation(id: string, updates: UpdateObservationDto)`
Met à jour une observation existante
```typescript
const updatedObservation = await updateObservation('observation-id', {
  description: 'Description mise à jour'
});
```

### `deleteObservation(id: string)`
Supprime une observation
```typescript
await deleteObservation('observation-id');
```

### `getObservationsNearLocation(latitude, longitude, radiusKm)`
Récupère les observations près d'un emplacement
```typescript
const nearbyObservations = await getObservationsNearLocation(45.5017, -73.5673, 10);
```

## Hook useObservations()

Ce hook gère une liste d'observations avec les états de chargement et les erreurs.

### Utilisation

```typescript
import { useObservations } from '../hooks/useObservations';

const MyComponent = () => {
  const {
    observations,
    isLoading,
    error,
    refetch,
    createNewObservation,
    updateExistingObservation,
    deleteExistingObservation
  } = useObservations();

  if (isLoading) return <Text>Chargement...</Text>;
  if (error) return <Text>Erreur: {error}</Text>;

  return (
    <FlatList
      data={observations}
      renderItem={({ item }) => <ObservationItem observation={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};
```

### Propriétés retournées

- `observations: Observation[]` - Liste des observations
- `isLoading: boolean` - État de chargement
- `error: string | null` - Message d'erreur éventuel
- `refetch: () => Promise<void>` - Recharge les données
- `createNewObservation: (observation: CreateObservationDto) => Promise<Observation>` - Crée une nouvelle observation
- `updateExistingObservation: (id: string, updates: UpdateObservationDto) => Promise<Observation>` - Met à jour une observation
- `deleteExistingObservation: (id: string) => Promise<void>` - Supprime une observation
- `getObservationsNear: (latitude: number, longitude: number, radiusKm?: number) => Promise<void>` - Récupère les observations près d'un emplacement

## Hook useObservation(id: string)

Ce hook gère une observation unique avec les états de chargement et les erreurs.

### Utilisation

```typescript
import { useObservation } from '../hooks/useObservation';

const ObservationDetail = ({ observationId }: { observationId: string }) => {
  const {
    observation,
    isLoading,
    error,
    refetch,
    updateObservation,
    deleteObservation
  } = useObservation(observationId);

  if (isLoading) return <Text>Chargement...</Text>;
  if (error) return <Text>Erreur: {error}</Text>;
  if (!observation) return <Text>Observation non trouvée</Text>;

  return (
    <View>
      <Text>{observation.species}</Text>
      <Text>{observation.description}</Text>
    </View>
  );
};
```

## Configuration de l'API

N'oubliez pas de configurer l'URL de base de votre API dans le fichier `api/api.ts` :

```typescript
const API_BASE_URL = 'https://your-api-url.com/api';
```

## Gestion des erreurs

Tous les hooks gèrent automatiquement les erreurs et fournissent un état `error`. Les fonctions de mutation (create, update, delete) peuvent également lever des exceptions que vous pouvez capturer avec try/catch.

```typescript
const handleCreate = async () => {
  try {
    await createNewObservation(newObservationData);
    // Succès
  } catch (error) {
    // Gérer l'erreur
    console.error('Erreur lors de la création:', error);
  }
};
```

## Exemple complet

Voir le fichier `components/ObservationsListExample.tsx` pour un exemple complet d'utilisation des hooks dans un composant React Native.