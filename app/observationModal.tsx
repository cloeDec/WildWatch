import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useObservations } from '../hooks/useObservations';
import { CreateObservationDto } from '../types/observation';

export default function ObservationModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ latitude?: string; longitude?: string }>();
  const { createNewObservation, isLoading } = useObservations();
  const speciesInputRef = useRef<TextInput>(null);

  const [formData, setFormData] = useState({
    species: '',
    description: '',
  });

  const latitude = params.latitude ? parseFloat(params.latitude) : 0;
  const longitude = params.longitude ? parseFloat(params.longitude) : 0;

  // Focus automatique sur le champ espèce au montage de la modale (optimisé pour Android)
  useEffect(() => {
    const timer = setTimeout(() => {
      speciesInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!formData.species.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner l\'espèce observée');
      return;
    }

    try {
      console.log('Tentative de création d\'observation:', { latitude, longitude, species: formData.species });

      const observationData: CreateObservationDto = {
        species: formData.species.trim(),
        description: formData.description.trim() || undefined,
        latitude,
        longitude,
        accuracy: 5, // Default accuracy
      };

      console.log('Données de l\'observation:', observationData);

      const newObservation = await createNewObservation(observationData);
      console.log('Observation créée:', newObservation);

      Alert.alert('Succès', 'Observation créée avec succès !', [
        { text: 'OK', onPress: handleClose },
      ]);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      Alert.alert('Erreur', `Impossible de créer l'observation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlay} onPress={handleClose} activeOpacity={1}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>Nouvelle Observation</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>📍 Position</Text>
                <Text style={styles.locationText}>
                  {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Espèce observée *</Text>
                <TextInput
                  ref={speciesInputRef}
                  style={styles.input}
                  value={formData.species}
                  onChangeText={(text) => setFormData({ ...formData, species: text })}
                  placeholder="Ex: Renard roux, Aigle royal..."
                  placeholderTextColor="#999"
                  autoFocus={true}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description (optionnel)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Décrivez votre observation (comportement, taille, couleur...)"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Création...' : 'Créer l\'observation'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    marginTop: '20%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  locationInfo: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#1565c0',
    fontFamily: 'monospace',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});