export interface Observation {
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

export interface CreateObservationDto {
  species: string;
  description?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  photos?: string[];
  weather?: {
    temperature?: number;
    conditions?: string;
  };
}

export interface UpdateObservationDto {
  species?: string;
  description?: string;
  photos?: string[];
  weather?: {
    temperature?: number;
    conditions?: string;
  };
}