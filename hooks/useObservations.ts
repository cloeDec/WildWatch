import { useState, useEffect, useCallback } from 'react';
import { Observation, CreateObservationDto, UpdateObservationDto } from '../types/observation';
import {
  getObservations,
  createObservation,
  updateObservation,
  deleteObservation,
  getObservationsNearLocation,
} from '../api/localApi';

interface UseObservationsState {
  observations: Observation[];
  isLoading: boolean;
  error: string | null;
}

interface UseObservationsActions {
  refetch: () => Promise<void>;
  createNewObservation: (observation: CreateObservationDto) => Promise<Observation>;
  updateExistingObservation: (id: string, updates: UpdateObservationDto) => Promise<Observation>;
  deleteExistingObservation: (id: string) => Promise<void>;
  getObservationsNear: (latitude: number, longitude: number, radiusKm?: number) => Promise<void>;
}

export type UseObservationsReturn = UseObservationsState & UseObservationsActions;

export const useObservations = (): UseObservationsReturn => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObservations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getObservations();
      setObservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch observations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchObservations();
  }, [fetchObservations]);

  const createNewObservation = useCallback(async (observation: CreateObservationDto) => {
    try {
      setError(null);
      const newObservation = await createObservation(observation);
      setObservations(prev => [newObservation, ...prev]);
      return newObservation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create observation';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateExistingObservation = useCallback(async (id: string, updates: UpdateObservationDto) => {
    try {
      setError(null);
      const updatedObservation = await updateObservation(id, updates);
      setObservations(prev =>
        prev.map(obs => obs.id === id ? updatedObservation : obs)
      );
      return updatedObservation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update observation';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteExistingObservation = useCallback(async (id: string) => {
    try {
      setError(null);
      await deleteObservation(id);
      setObservations(prev => prev.filter(obs => obs.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete observation';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getObservationsNear = useCallback(async (
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getObservationsNearLocation(latitude, longitude, radiusKm);
      setObservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nearby observations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);

  return {
    observations,
    isLoading,
    error,
    refetch,
    createNewObservation,
    updateExistingObservation,
    deleteExistingObservation,
    getObservationsNear,
  };
};