export const MAPBOX_PUBLIC_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN;
export const MAPBOX_PRIVATE_TOKEN = process.env.MAPBOX_PRIVATE_TOKEN;

export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || 'WildWatch';
export const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0';

if (!MAPBOX_PUBLIC_TOKEN) {
  console.warn('⚠️ MAPBOX_PUBLIC_TOKEN manquant dans .env');
}

if (!MAPBOX_PRIVATE_TOKEN) {
  console.warn('⚠️ MAPBOX_PRIVATE_TOKEN manquant dans .env');
}

export const MAPBOX_CONFIG = {
  PUBLIC_TOKEN: MAPBOX_PUBLIC_TOKEN,
  PRIVATE_TOKEN: MAPBOX_PRIVATE_TOKEN,
  DEFAULT_STYLE: 'mapbox://styles/mapbox/outdoors-v12',
  DEFAULT_ZOOM: 16,
  DEFAULT_PITCH: 0,
  DEFAULT_HEADING: 0,
  USER_LOCATION_ZOOM: 16,
} as const;