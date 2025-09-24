import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Mapbox from "@rnmapbox/maps";
import { Observation } from '../types/observation';

interface ObservationMarkersProps {
  observations: Observation[];
  onObservationPress: (observation: Observation) => void;
}

export const ObservationMarkers: React.FC<ObservationMarkersProps> = ({
  observations,
  onObservationPress,
}) => {
  return (
    <>
      {observations.map((observation) => {
        console.log(
          "ObservationMarkers: Rendu pin pour observation:",
          observation.id,
          "à",
          observation.latitude,
          observation.longitude
        );
        return (
          <Mapbox.MarkerView
            key={observation.id}
            id={`observation-${observation.id}`}
            coordinate={[observation.longitude, observation.latitude]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <TouchableOpacity
              style={styles.observationDropletPin}
              onPress={() => onObservationPress(observation)}
              activeOpacity={0.7}
            >
              <View style={styles.pinShadow} />
              <View style={styles.dropletShape}>
                <View style={styles.dropletTop}>
                  <Image
                    source={require("../assets/images/raccoon.png")}
                    style={styles.dropletImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.dropletNeck} />
                <View style={styles.dropletTip} />
              </View>
            </TouchableOpacity>
          </Mapbox.MarkerView>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  observationDropletPin: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    width: 40,
  },
  pinShadow: {
    position: 'absolute',
    bottom: -1,
    left: 3,
    width: 34,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 17,
    opacity: 0.6,
  },
  dropletShape: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 55,
    width: 36,
  },
  dropletTop: {
    width: 36,
    height: 36,
    backgroundColor: '#DC2626',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 3,
  },
  dropletNeck: {
    width: 16,
    height: 10,
    backgroundColor: '#DC2626',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: 'white',
    marginTop: -2,
    zIndex: 2,
  },
  dropletTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#DC2626',
    marginTop: -2,
    zIndex: 1,
  },
  dropletImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});