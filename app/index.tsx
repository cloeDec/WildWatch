import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { LocationLoadingScreen } from '../components/LocationLoadingScreen';
import { LocationUnauthorizedScreen } from '../components/LocationUnauthorizedScreen';
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
          <LocationUnauthorizedScreen
            onRetry={refreshLocation}
            error={error || undefined}
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
