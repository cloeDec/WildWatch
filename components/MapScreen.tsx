import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { MAPBOX_CONFIG } from "../config/env";
import { useObservationsStore } from "../hooks/useObservationsStore";
import { UserLocationMarker } from "./UserLocationMarker";
import { ObservationMarkers } from "./ObservationMarkers";
import { AccuracyCircle } from "./AccuracyCircle";
import { Observation } from "../types/observation";

if (MAPBOX_CONFIG.PUBLIC_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_CONFIG.PUBLIC_TOKEN);
} else {
  console.error(
    "❌ Token Mapbox public manquant - vérifiez votre fichier .env"
  );
}

interface MapScreenProps {
  location: Location.LocationObject;
}

const { width, height } = Dimensions.get("window");

export const MapScreen: React.FC<MapScreenProps> = ({ location }) => {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const router = useRouter();
  const { observations, loadObservations } = useObservationsStore();


  useFocusEffect(
    useCallback(() => {
      loadObservations();
    }, [loadObservations])
  );

  useEffect(() => {
    if (MAPBOX_CONFIG.PUBLIC_TOKEN) {
      Mapbox.setAccessToken(MAPBOX_CONFIG.PUBLIC_TOKEN);
    }
  }, []);

  useEffect(() => {
    if (location && cameraRef.current) {
      const coordinates: [number, number] = [location.coords.longitude, location.coords.latitude];

      const timer = setTimeout(() => {
        cameraRef.current?.setCamera({
          centerCoordinate: coordinates,
          zoomLevel: MAPBOX_CONFIG.USER_LOCATION_ZOOM,
          animationDuration: 2000,
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const coordinates: [number, number] = [location.coords.longitude, location.coords.latitude];

  const handleMapPress = (feature: any) => {
    if (feature.geometry && feature.geometry.coordinates) {
      const [longitude, latitude] = feature.geometry.coordinates;
      router.push({
        pathname: "/observationModal",
        params: {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      });
    }
  };

  const handleObservationPress = (observation: Observation) => {
    router.push({
      pathname: "/observationModal",
      params: {
        observationId: observation.id,
        latitude: observation.latitude.toString(),
        longitude: observation.longitude.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={MAPBOX_CONFIG.DEFAULT_STYLE}
        compassEnabled={true}
        compassFadeWhenNorth={false}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        attributionEnabled={true}
        logoEnabled={true}
        onPress={handleMapPress}
      >
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={coordinates}
          zoomLevel={10}
          pitch={MAPBOX_CONFIG.DEFAULT_PITCH}
          heading={MAPBOX_CONFIG.DEFAULT_HEADING}
          animationDuration={1500}
          followUserLocation={false}
        />
        <UserLocationMarker coordinates={coordinates} />

        <ObservationMarkers
          observations={observations}
          onObservationPress={handleObservationPress}
        />

        <AccuracyCircle
          coordinates={coordinates}
          accuracy={location.coords.accuracy || 0}
        />
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
