import React from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox from "@rnmapbox/maps";

interface UserLocationMarkerProps {
  coordinates: [number, number];
}

export const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ coordinates }) => {
  return (
    <>
      <Mapbox.UserLocation
        visible={true}
        showsUserHeadingIndicator={true}
        androidRenderMode="gps"
        requestsAlwaysUse={false}
      />
      <Mapbox.MarkerView id="user-position" coordinate={coordinates}>
        <View style={styles.markerContainer}>
          <View style={styles.markerInner} />
          <View style={styles.markerOuter} />
        </View>
      </Mapbox.MarkerView>
    </>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    position: 'absolute',
    zIndex: 2,
  },
  markerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    zIndex: 1,
  },
});