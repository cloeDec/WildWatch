import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { MAPBOX_CONFIG } from "../config/env";
import { useObservationsStore } from "../hooks/useObservationsStore";

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
  const { observations } = useObservationsStore();

  console.log('MapScreen: Nombre d\'observations:', observations.length);
  console.log('MapScreen: Observations:', observations.map(o => ({ id: o.id, species: o.species })));

  useEffect(() => {
    if (MAPBOX_CONFIG.PUBLIC_TOKEN) {
      Mapbox.setAccessToken(MAPBOX_CONFIG.PUBLIC_TOKEN);
    }
  }, []);

  useEffect(() => {
    if (location && cameraRef.current) {
      const coordinates = [location.coords.longitude, location.coords.latitude];

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

  const coordinates = [location.coords.longitude, location.coords.latitude];

  const handleMapPress = (feature: any) => {
    if (feature.geometry && feature.geometry.coordinates) {
      const [longitude, latitude] = feature.geometry.coordinates;
      router.push({
        pathname: '/observationModal',
        params: {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      });
    }
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
        <Mapbox.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          androidRenderMode="gps"
          requestsAlwaysUse={false}
        />
        <Mapbox.PointAnnotation id="user-position" coordinate={coordinates}>
          <View style={styles.markerContainer}>
            <View style={styles.markerInner} />
            <View style={styles.markerOuter} />
          </View>
        </Mapbox.PointAnnotation>

        {/* Affichage des observations existantes */}
        {observations.map((observation) => (
          <Mapbox.PointAnnotation
            key={observation.id}
            id={`observation-${observation.id}`}
            coordinate={[observation.longitude, observation.latitude]}
          >
            <View style={styles.observationPin}>
              <View style={styles.observationPinInner}>
                <Text style={styles.observationPinText}>🦌</Text>
              </View>
              <View style={styles.observationPinPointer} />
            </View>
          </Mapbox.PointAnnotation>
        ))}
        {location.coords.accuracy && (
          <Mapbox.ShapeSource
            id="accuracy-circle"
            shape={{
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coordinates,
              },
              properties: {
                radius: location.coords.accuracy,
              },
            }}
          >
            <Mapbox.CircleLayer
              id="accuracy-circle-layer"
              style={{
                circleRadius: [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  10,
                  ["/", ["get", "radius"], 4],
                  20,
                  ["get", "radius"],
                ],
                circleColor: "rgba(0, 122, 255, 0.1)",
                circleStrokeColor: "rgba(0, 122, 255, 0.3)",
                circleStrokeWidth: 1,
              }}
            />
          </Mapbox.ShapeSource>
        )}
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
  markerContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
    position: "absolute",
    zIndex: 2,
  },
  markerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.3)",
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
    zIndex: 1,
  },
  observationPin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  observationPinInner: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  observationPinText: {
    fontSize: 18,
  },
  observationPinPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF6B35',
    marginTop: -2,
  },
});
