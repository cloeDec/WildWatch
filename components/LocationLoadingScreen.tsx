import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LocationLoadingScreenProps {
  message?: string;
}

export const LocationLoadingScreen: React.FC<LocationLoadingScreenProps> = ({
  message = "Récupération de votre position..."
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        <Text style={styles.title}>Géolocalisation</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.dotsContainer}>
          <Text style={styles.dots}>•••</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 280,
  },
  spinner: {
    marginBottom: 20,
    transform: [{ scale: 1.5 }],
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  dotsContainer: {
    height: 20,
  },
  dots: {
    fontSize: 18,
    color: '#007AFF',
    letterSpacing: 4,
  },
});