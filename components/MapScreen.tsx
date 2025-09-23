import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { MAPBOX_CONFIG } from "../config/env";

// Initialiser Mapbox avec le token public depuis .env
if (MAPBOX_CONFIG.PUBLIC_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_CONFIG.PUBLIC_TOKEN);
} else {
  console.error('❌ Token Mapbox public manquant - vérifiez votre fichier .env');
}

interface MapScreenProps {
  location: Location.LocationObject;
}

const { width, height } = Dimensions.get("window");

export const MapScreen: React.FC<MapScreenProps> = ({ location }) => {
  useEffect(() => {
    if (MAPBOX_CONFIG.PUBLIC_TOKEN) {
      Mapbox.setAccessToken(MAPBOX_CONFIG.PUBLIC_TOKEN);
    }
  }, []);

  const coordinates = [location.coords.longitude, location.coords.latitude];

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
      >
        <Mapbox.Camera
          centerCoordinate={coordinates}
          zoomLevel={MAPBOX_CONFIG.DEFAULT_ZOOM}
          pitch={MAPBOX_CONFIG.DEFAULT_PITCH}
          heading={MAPBOX_CONFIG.DEFAULT_HEADING}
          animationDuration={1000}
          followUserLocation={true}
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
});
