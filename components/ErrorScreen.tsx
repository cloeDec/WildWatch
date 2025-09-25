import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  retryButtonText?: string;
  goBackButtonText?: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = 'Une erreur est survenue',
  message = 'Quelque chose s\'est mal passé. Veuillez réessayer.',
  onRetry,
  onGoBack,
  retryButtonText = 'Réessayer',
  goBackButtonText = 'Retour'
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>
          {message}
        </Text>

        <View style={styles.buttonsContainer}>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>{retryButtonText}</Text>
            </TouchableOpacity>
          )}

          {onGoBack && (
            <TouchableOpacity style={styles.goBackButton} onPress={onGoBack}>
              <Text style={styles.goBackButtonText}>{goBackButtonText}</Text>
            </TouchableOpacity>
          )}
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
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 350,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b6b20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  buttonsContainer: {
    width: '100%',
    gap: 15,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  goBackButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    width: '100%',
  },
  goBackButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});