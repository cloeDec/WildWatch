import { Observation, CreateObservationDto, UpdateObservationDto } from '../types/observation';

// Base URL for your API - adjust this to your actual backend URL
const API_BASE_URL = 'https://your-api-url.com/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};

/**
 * Retrieve all observations
 */
export const getObservations = async (): Promise<Observation[]> => {
  return apiRequest('/observations');
};

/**
 * Retrieve a single observation by ID
 */
export const getObservation = async (id: string): Promise<Observation> => {
  return apiRequest(`/observations/${id}`);
};

/**
 * Create a new observation
 */
export const createObservation = async (observation: CreateObservationDto): Promise<Observation> => {
  const timestamp = Date.now();
  const observationWithTimestamp = {
    ...observation,
    timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return apiRequest('/observations', {
    method: 'POST',
    body: JSON.stringify(observationWithTimestamp),
  });
};

/**
 * Update an existing observation
 */
export const updateObservation = async (
  id: string,
  updates: UpdateObservationDto
): Promise<Observation> => {
  const updatesWithTimestamp = {
    ...updates,
    updatedAt: Date.now(),
  };

  return apiRequest(`/observations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatesWithTimestamp),
  });
};

/**
 * Delete an observation
 */
export const deleteObservation = async (id: string): Promise<void> => {
  return apiRequest(`/observations/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Get observations near a specific location
 */
export const getObservationsNearLocation = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<Observation[]> => {
  return apiRequest(`/observations/near?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`);
};