import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { LocationLoadingScreen } from '../components/LocationLoadingScreen';
import { LocationUnauthorizedScreen } from '../components/LocationUnauthorizedScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { MapScreen } from '../components/MapScreen';

export default function Index() {
  const { location, status, error, requestPermission, refreshLocation } = useCurrentPosition();

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <LocationLoadingScreen message="Récupération de votre position..." />;

      case 'denied':
        return (
          <LocationUnauthorizedScreen
            onRetry={requestPermission}
            error={error || undefined}
          />
        );

      case 'error':
        return (
          <ErrorScreen
            title="Erreur de géolocalisation"
            message={error || "Impossible d'obtenir votre position"}
            onRetry={refreshLocation}
          />
        );

      case 'granted':
        return location ? (
          <MapScreen location={location} />
        ) : (
          <LocationLoadingScreen message="Finalisation de la géolocalisation..." />
        );

      default:
        return <LocationLoadingScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
