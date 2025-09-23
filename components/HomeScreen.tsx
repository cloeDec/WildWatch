import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';

interface HomeScreenProps {
  location: Location.LocationObject;
  onRefresh: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ location, onRefresh }) => {
  const formatCoordinate = (coord: number, isLatitude: boolean): string => {
    const direction = isLatitude
      ? (coord >= 0 ? 'N' : 'S')
      : (coord >= 0 ? 'E' : 'O');

    const absoluteCoord = Math.abs(coord);
    const degrees = Math.floor(absoluteCoord);
    const minutes = Math.floor((absoluteCoord - degrees) * 60);
    const seconds = ((absoluteCoord - degrees - minutes / 60) * 3600).toFixed(2);

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getAccuracyColor = (accuracy?: number | null): string => {
    if (!accuracy) return '#999';
    if (accuracy <= 5) return '#4CAF50';
    if (accuracy <= 15) return '#FF9800';
    return '#F44336';
  };

  const getAccuracyText = (accuracy?: number | null): string => {
    if (!accuracy) return 'Inconnue';
    if (accuracy <= 5) return 'Excellente';
    if (accuracy <= 15) return 'Bonne';
    if (accuracy <= 50) return 'Moyenne';
    return 'Faible';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🌲 WildWatch</Text>
        <Text style={styles.subtitle}>Votre position actuelle</Text>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateRow}>
            <Text style={styles.coordinateLabel}>Latitude</Text>
            <Text style={styles.coordinateValue}>
              {location.coords.latitude.toFixed(6)}°
            </Text>
            <Text style={styles.coordinateDMS}>
              {formatCoordinate(location.coords.latitude, true)}
            </Text>
          </View>

          <View style={styles.coordinateRow}>
            <Text style={styles.coordinateLabel}>Longitude</Text>
            <Text style={styles.coordinateValue}>
              {location.coords.longitude.toFixed(6)}°
            </Text>
            <Text style={styles.coordinateDMS}>
              {formatCoordinate(location.coords.longitude, false)}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Précision</Text>
            <View style={styles.accuracyContainer}>
              <View style={[
                styles.accuracyDot,
                { backgroundColor: getAccuracyColor(location.coords.accuracy) }
              ]} />
              <Text style={styles.detailValue}>
                ±{location.coords.accuracy?.toFixed(0) || '?'}m
              </Text>
              <Text style={styles.accuracyText}>
                ({getAccuracyText(location.coords.accuracy)})
              </Text>
            </View>
          </View>

          {location.coords.altitude !== null && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Altitude</Text>
              <Text style={styles.detailValue}>
                {location.coords.altitude.toFixed(0)}m
              </Text>
            </View>
          )}

          {location.coords.speed !== null && location.coords.speed > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vitesse</Text>
              <Text style={styles.detailValue}>
                {(location.coords.speed * 3.6).toFixed(1)} km/h
              </Text>
            </View>
          )}

          {location.coords.heading !== null && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Direction</Text>
              <Text style={styles.detailValue}>
                {location.coords.heading.toFixed(0)}°
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dernière mise à jour</Text>
            <Text style={styles.detailValue}>
              {formatTimestamp(location.timestamp)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>🔄 Actualiser la position</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Le saviez-vous ?</Text>
        <Text style={styles.infoText}>
          WildWatch utilise le GPS de votre appareil pour déterminer votre position avec précision.
          Une meilleure précision est obtenue en extérieur avec une vue dégagée du ciel.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  mainCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  coordinatesContainer: {
    marginBottom: 20,
  },
  coordinateRow: {
    marginBottom: 15,
  },
  coordinateLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  coordinateValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
  coordinateDMS: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 20,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  accuracyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});