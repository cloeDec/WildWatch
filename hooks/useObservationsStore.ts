import { useState, useEffect, useCallback } from 'react';
import { Observation, CreateObservationDto } from '../types/observation';
import { observationsStore } from '../store/observationsStore';

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const useObservationsStore = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // S'abonner au store au montage
  useEffect(() => {
    console.log('useObservationsStore: Abonnement au store');

    // Charger les données initiales
    setObservations(observationsStore.getObservations());

    // S'abonner aux changements
    const unsubscribe = observationsStore.subscribe((newObservations) => {
      console.log('useObservationsStore: Mise à jour reçue:', newObservations.length, 'observations');
      setObservations(newObservations);
    });

    // Nettoyage au démontage
    return () => {
      console.log('useObservationsStore: Désabonnement du store');
      unsubscribe();
    };
  }, []);

  const createNewObservation = useCallback(async (observationData: CreateObservationDto) => {
    console.log('useObservationsStore: createNewObservation appelée');
    console.log('useObservationsStore: Données reçues:', observationData);

    try {
      setIsLoading(true);
      setError(null);

      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300));

      // Créer l'observation
      const timestamp = Date.now();
      const newObservation: Observation = {
        id: generateId(),
        ...observationData,
        timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      console.log('useObservationsStore: Nouvelle observation créée:', newObservation);

      // Ajouter au store global
      observationsStore.addObservation(newObservation);

      console.log('useObservationsStore: Store stats:', observationsStore.getStats());

      return newObservation;
    } catch (error) {
      console.error('useObservationsStore: Erreur:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadObservations = useCallback(() => {
    const currentObservations = observationsStore.getObservations();
    setObservations(currentObservations);
    console.log('useObservationsStore: Observations rechargées:', currentObservations.length);
  }, []);

  return {
    observations,
    isLoading,
    error,
    createNewObservation,
    loadObservations,
  };
};