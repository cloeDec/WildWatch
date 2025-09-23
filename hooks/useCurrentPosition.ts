import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export type LocationStatus = 'loading' | 'granted' | 'denied' | 'error';

export interface LocationState {
  location: Location.LocationObject | null;
  status: LocationStatus;
  error: string | null;
  requestPermission: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

export const useCurrentPosition = (): LocationState => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [status, setStatus] = useState<LocationStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async (): Promise<void> => {
    try {
      setStatus('loading');
      setError(null);

      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== 'granted') {
        setStatus('denied');
        setError('Permission d\'accès à la localisation refusée');
        return;
      }

      await getCurrentLocation();
    } catch (err) {
      setStatus('error');
      setError(`Erreur lors de la demande de permission: ${err}`);
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      setStatus('loading');
      setError(null);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      setStatus('granted');
    } catch (err) {
      setStatus('error');
      setError(`Erreur lors de la récupération de la position: ${err}`);
    }
  };

  const refreshLocation = async (): Promise<void> => {
    const { status: permissionStatus } = await Location.getForegroundPermissionsAsync();

    if (permissionStatus !== 'granted') {
      setStatus('denied');
      setError('Permission d\'accès à la localisation requise');
      return;
    }

    await getCurrentLocation();
  };

  useEffect(() => {
    const initializeLocation = async () => {
      const { status: permissionStatus } = await Location.getForegroundPermissionsAsync();

      if (permissionStatus === 'granted') {
        await getCurrentLocation();
      } else {
        setStatus('denied');
        setError('Permission d\'accès à la localisation requise');
      }
    };

    initializeLocation();
  }, []);

  return {
    location,
    status,
    error,
    requestPermission,
    refreshLocation,
  };
};