import { useCallback, useEffect, useState } from "react";
import { observationsStore } from "../store/observationsStore";
import { CreateObservationDto, Observation } from "../types/observation";

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const useObservationsStore = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    setObservations(observationsStore.getObservations());

    const unsubscribe = observationsStore.subscribe((newObservations) => {
      setObservations(newObservations);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createNewObservation = useCallback(
    async (observationData: CreateObservationDto) => {

      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 300));

        const timestamp = Date.now();
        const newObservation: Observation = {
          id: generateId(),
          ...observationData,
          timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        };


        observationsStore.addObservation(newObservation);


        return newObservation;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateObservation = useCallback(
    async (observationData: Observation) => {

      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 300));


        observationsStore.updateObservation(observationData);


        return observationData;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteObservation = useCallback(async (observationId: string) => {

    try {
      setIsLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));


      observationsStore.deleteObservation(observationId);

      console.log(
        "useObservationsStore: Store stats:",
        observationsStore.getStats()
      );

      return true;
    } catch (error) {
      console.error("useObservationsStore: Erreur:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadObservations = useCallback(() => {
    const currentObservations = observationsStore.getObservations();
    setObservations(currentObservations);
  }, []);

  return {
    observations,
    isLoading,
    error,
    createNewObservation,
    updateObservation,
    deleteObservation,
    loadObservations,
  };
};
