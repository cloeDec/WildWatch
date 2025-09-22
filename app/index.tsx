import { Text, View, StyleSheet } from "react-native";
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        console.log('Current location:', currentLocation);
      } catch (error) {
        setErrorMsg('Error getting location: ' + error);
        console.log('Error getting location:', error);
      }
    }

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WildWatch</Text>

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : location ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Votre position:</Text>
          <Text style={styles.locationText}>
            Latitude: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Précision: ±{location.coords.accuracy?.toFixed(0)}m
          </Text>
        </View>
      ) : (
        <Text style={styles.loading}>Chargement de la localisation...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  locationContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    color: '#666',
  },
});
