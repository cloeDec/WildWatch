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
    console.log("useObservationsStore: Abonnement au store");

    setObservations(observationsStore.getObservations());

    const unsubscribe = observationsStore.subscribe((newObservations) => {
      console.log(
        "useObservationsStore: Mise à jour reçue:",
        newObservations.length,
        "observations"
      );
      setObservations(newObservations);
    });

    return () => {
      console.log("useObservationsStore: Désabonnement du store");
      unsubscribe();
    };
  }, []);

  const createNewObservation = useCallback(
    async (observationData: CreateObservationDto) => {
      console.log("useObservationsStore: createNewObservation appelée");
      console.log("useObservationsStore: Données reçues:", observationData);

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

        console.log(
          "useObservationsStore: Nouvelle observation créée:",
          newObservation
        );

        observationsStore.addObservation(newObservation);

        console.log(
          "useObservationsStore: Store stats:",
          observationsStore.getStats()
        );

        return newObservation;
      } catch (error) {
        console.error("useObservationsStore: Erreur:", error);
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
      console.log("useObservationsStore: updateObservation appelée");
      console.log("useObservationsStore: Données reçues:", observationData);

      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 300));

        console.log(
          "useObservationsStore: Observation modifiée:",
          observationData
        );

        observationsStore.updateObservation(observationData);

        console.log(
          "useObservationsStore: Store stats:",
          observationsStore.getStats()
        );

        return observationData;
      } catch (error) {
        console.error("useObservationsStore: Erreur:", error);
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
    console.log("useObservationsStore: deleteObservation appelée");
    console.log("useObservationsStore: ID reçu:", observationId);

    try {
      setIsLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log(
        "useObservationsStore: Suppression de l'observation:",
        observationId
      );

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
    console.log(
      "useObservationsStore: Observations rechargées:",
      currentObservations.length
    );
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
