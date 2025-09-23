import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useObservations } from '../hooks/useObservations';
import { Observation } from '../types/observation';

export const ObservationsListExample: React.FC = () => {
  const { observations, isLoading, error, createNewObservation, deleteExistingObservation } = useObservations();

  const handleCreateObservation = async () => {
    try {
      await createNewObservation({
        species: 'Example Species',
        description: 'Example observation created from the app',
        latitude: 45.5017,
        longitude: -73.5673,
        accuracy: 5,
      });
      Alert.alert('Succès', 'Observation créée avec succès');
    } catch {
      Alert.alert('Erreur', 'Impossible de créer l\'observation');
    }
  };

  const handleDeleteObservation = (id: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette observation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExistingObservation(id);
              Alert.alert('Succès', 'Observation supprimée');
            } catch {
              Alert.alert('Erreur', 'Impossible de supprimer l\'observation');
            }
          }
        }
      ]
    );
  };

  const renderObservation = ({ item }: { item: Observation }) => (
    <View style={styles.observationCard}>
      <Text style={styles.species}>{item.species}</Text>
      {item.description && <Text style={styles.description}>{item.description}</Text>}
      <Text style={styles.coordinates}>
        {item.latitude.toFixed(6)}°, {item.longitude.toFixed(6)}°
      </Text>
      <Text style={styles.date}>
        {new Date(item.timestamp).toLocaleDateString('fr-FR')}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteObservation(item.id)}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Chargement des observations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Observations ({observations.length})</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateObservation}>
          <Text style={styles.createButtonText}>+ Nouvelle observation</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={observations}
        renderItem={renderObservation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune observation trouvée</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  observationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  species: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  coordinates: {
    fontSize: 12,
    color: '#007AFF',
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});