import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observation, CreateObservationDto, UpdateObservationDto } from '../types/observation';

const OBSERVATIONS_KEY = 'wildwatch_observations';

// Fonction pour générer un ID unique
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Fonction pour récupérer toutes les observations du storage
const getStoredObservations = async (): Promise<Observation[]> => {
  try {
    const stored = await AsyncStorage.getItem(OBSERVATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture des observations:', error);
    return [];
  }
};

// Fonction pour sauvegarder les observations dans le storage
const saveObservations = async (observations: Observation[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(OBSERVATIONS_KEY, JSON.stringify(observations));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des observations:', error);
    throw new Error('Impossible de sauvegarder les observations');
  }
};

/**
 * Récupérer toutes les observations depuis le stockage local
 */
export const getObservations = async (): Promise<Observation[]> => {
  return getStoredObservations();
};

/**
 * Récupérer une observation par son ID
 */
export const getObservation = async (id: string): Promise<Observation> => {
  const observations = await getStoredObservations();
  const observation = observations.find(obs => obs.id === id);

  if (!observation) {
    throw new Error(`Observation avec l'ID ${id} non trouvée`);
  }

  return observation;
};

/**
 * Créer une nouvelle observation
 */
export const createObservation = async (observation: CreateObservationDto): Promise<Observation> => {
  try {
    console.log('createObservation appelée avec:', observation);

    const observations = await getStoredObservations();
    console.log('Observations existantes:', observations.length);

    const timestamp = Date.now();

    const newObservation: Observation = {
      id: generateId(),
      ...observation,
      timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    console.log('Nouvelle observation créée:', newObservation);

    const updatedObservations = [newObservation, ...observations];
    await saveObservations(updatedObservations);

    console.log('Observation sauvegardée avec succès');

    return newObservation;
  } catch (error) {
    console.error('Erreur dans createObservation:', error);
    throw error;
  }
};

/**
 * Mettre à jour une observation existante
 */
export const updateObservation = async (
  id: string,
  updates: UpdateObservationDto
): Promise<Observation> => {
  const observations = await getStoredObservations();
  const observationIndex = observations.findIndex(obs => obs.id === id);

  if (observationIndex === -1) {
    throw new Error(`Observation avec l'ID ${id} non trouvée`);
  }

  const updatedObservation: Observation = {
    ...observations[observationIndex],
    ...updates,
    updatedAt: Date.now(),
  };

  observations[observationIndex] = updatedObservation;
  await saveObservations(observations);

  return updatedObservation;
};

/**
 * Supprimer une observation
 */
export const deleteObservation = async (id: string): Promise<void> => {
  const observations = await getStoredObservations();
  const filteredObservations = observations.filter(obs => obs.id !== id);

  if (filteredObservations.length === observations.length) {
    throw new Error(`Observation avec l'ID ${id} non trouvée`);
  }

  await saveObservations(filteredObservations);
};

/**
 * Récupérer les observations près d'une localisation (simulation basique)
 */
export const getObservationsNearLocation = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<Observation[]> => {
  const observations = await getStoredObservations();

  // Calcul simple de distance (approximation)
  return observations.filter(obs => {
    const latDiff = Math.abs(obs.latitude - latitude);
    const lngDiff = Math.abs(obs.longitude - longitude);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    // Conversion approximative en km (1 degré ≈ 111 km)
    const distanceKm = distance * 111;
    return distanceKm <= radiusKm;
  });
};

/**
 * Fonction utilitaire pour vider toutes les observations (pour debug)
 */
export const clearAllObservations = async (): Promise<void> => {
  await AsyncStorage.removeItem(OBSERVATIONS_KEY);
};

/**
 * Fonction utilitaire pour obtenir le nombre total d'observations
 */
export const getObservationsCount = async (): Promise<number> => {
  const observations = await getStoredObservations();
  return observations.length;
};