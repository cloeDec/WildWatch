import { useState, useEffect, useCallback } from 'react';
import { Observation, UpdateObservationDto } from '../types/observation';
import { getObservation, updateObservation, deleteObservation } from '../api/localApi';

interface UseObservationState {
  observation: Observation | null;
  isLoading: boolean;
  error: string | null;
}

interface UseObservationActions {
  refetch: () => Promise<void>;
  updateObservation: (updates: UpdateObservationDto) => Promise<Observation>;
  deleteObservation: () => Promise<void>;
}

export type UseObservationReturn = UseObservationState & UseObservationActions;

export const useObservation = (id: string | null): UseObservationReturn => {
  const [observation, setObservation] = useState<Observation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchObservation = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getObservation(id);
      setObservation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch observation');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refetch = useCallback(async () => {
    await fetchObservation();
  }, [fetchObservation]);

  const updateExistingObservation = useCallback(async (updates: UpdateObservationDto) => {
    if (!id) {
      throw new Error('No observation ID provided');
    }

    try {
      setError(null);
      const updatedObservation = await updateObservation(id, updates);
      setObservation(updatedObservation);
      return updatedObservation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update observation';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [id]);

  const deleteExistingObservation = useCallback(async () => {
    if (!id) {
      throw new Error('No observation ID provided');
    }

    try {
      setError(null);
      await deleteObservation(id);
      setObservation(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete observation';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchObservation();
    } else {
      setObservation(null);
      setError(null);
      setIsLoading(false);
    }
  }, [fetchObservation, id]);

  return {
    observation,
    isLoading,
    error,
    refetch,
    updateObservation: updateExistingObservation,
    deleteObservation: deleteExistingObservation,
  };
};