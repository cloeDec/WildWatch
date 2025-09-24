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
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DatePicker from 'react-native-date-picker';
import { useObservationsStore } from '../hooks/useObservationsStore';
import { CreateObservationDto } from '../types/observation';

export default function ObservationModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ latitude?: string; longitude?: string; observationId?: string }>();

  console.log('ObservationModal: Appel de useObservationsStore...');
  const hookResult = useObservationsStore();
  console.log('ObservationModal: Résultat du hook simple:', hookResult);
  console.log('ObservationModal: Type de hookResult:', typeof hookResult);
  console.log('ObservationModal: Clés disponibles:', hookResult ? Object.keys(hookResult) : 'hookResult est null/undefined');

  const { createNewObservation, updateObservation, deleteObservation, observations, isLoading } = hookResult || {};
  console.log('ObservationModal: createNewObservation:', createNewObservation);
  console.log('ObservationModal: Type de createNewObservation:', typeof createNewObservation);

  const speciesInputRef = useRef<TextInput>(null);

  const [formData, setFormData] = useState({
    species: '',
    observationDate: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
  });

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const latitude = params.latitude ? parseFloat(params.latitude) : 0;
  const longitude = params.longitude ? parseFloat(params.longitude) : 0;
  const observationId = params.observationId;
  const isEditing = !!observationId;

  // Trouver l'observation à éditer si on est en mode édition
  const existingObservation = isEditing ? observations?.find(obs => obs.id === observationId) : null;

  console.log('ObservationModal: isEditing =', isEditing);
  console.log('ObservationModal: observationId =', observationId);
  console.log('ObservationModal: observations count =', observations?.length);
  console.log('ObservationModal: existingObservation =', existingObservation);

  // Initialiser les données du formulaire si on édite une observation existante
  useEffect(() => {
    if (isEditing && existingObservation) {
      setFormData({
        species: existingObservation.species,
        observationDate: new Date(existingObservation.timestamp).toISOString().split('T')[0],
      });
      setDate(new Date(existingObservation.timestamp));
      if (existingObservation.photos && existingObservation.photos.length > 0) {
        setPhotoUri(existingObservation.photos[0]);
      }
    }
  }, [isEditing, existingObservation]);

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

  const handleTakePhoto = async () => {
    try {
      console.log('handleTakePhoto: Début de la prise de photo');

      // Demander les permissions pour la caméra
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('handleTakePhoto: Status permission:', status);

      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à la caméra.');
        return;
      }

      // Proposer choix entre caméra et galerie
      Alert.alert(
        'Choisir une photo',
        'Comment voulez-vous ajouter une photo ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Galerie', onPress: handlePickFromGallery },
          { text: 'Caméra', onPress: handleLaunchCamera },
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Module caméra non disponible. Utilisez la galerie à la place.');
      handlePickFromGallery();
    }
  };

  const handleLaunchCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        console.log('Photo prise:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur caméra:', error);
      Alert.alert('Erreur', 'Caméra non disponible. Essayez la galerie.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        console.log('Photo sélectionnée:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur galerie:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la galerie');
    }
  };

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setFormData({
      ...formData,
      observationDate: selectedDate.toISOString().split('T')[0]
    });
    setIsDatePickerOpen(false);
  };

  const handleDateCancel = () => {
    setIsDatePickerOpen(false);
  };

  const handleDelete = async () => {
    console.log('handleDelete: isEditing =', isEditing);
    console.log('handleDelete: observationId =', observationId);
    console.log('handleDelete: deleteObservation =', deleteObservation);

    if (!isEditing || !observationId || !deleteObservation) {
      console.log('handleDelete: Conditions non remplies, arrêt');
      return;
    }

    Alert.alert(
      'Supprimer l\'observation',
      'Êtes-vous sûr de vouloir supprimer cette observation ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Tentative de suppression d\'observation:', observationId);
              await deleteObservation(observationId);
              console.log('Observation supprimée:', observationId);

              Alert.alert('Succès', 'Observation supprimée avec succès !', [
                { text: 'OK', onPress: handleClose },
              ]);
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', `Impossible de supprimer l'observation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.species.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner l\'espèce observée');
      return;
    }

    if (!createNewObservation && !updateObservation) {
      Alert.alert('Erreur', 'Le système n\'est pas encore prêt. Veuillez réessayer dans un moment.');
      return;
    }

    try {
      if (isEditing && existingObservation && updateObservation) {
        // Mode édition
        console.log('Tentative de modification d\'observation:', { id: observationId, species: formData.species });

        const updatedObservation = {
          ...existingObservation,
          species: formData.species.trim(),
          timestamp: date.getTime(),
          updatedAt: Date.now(),
          photos: photoUri ? [photoUri] : existingObservation.photos,
        };

        await updateObservation(updatedObservation);
        console.log('Observation modifiée:', updatedObservation);

        Alert.alert('Succès', 'Observation modifiée avec succès !', [
          { text: 'OK', onPress: handleClose },
        ]);
      } else if (!isEditing && createNewObservation) {
        // Mode création
        console.log('Tentative de création d\'observation:', { latitude, longitude, species: formData.species });

        const observationData: CreateObservationDto = {
          species: formData.species.trim(),
          latitude,
          longitude,
          accuracy: 5, // Default accuracy
          photos: photoUri ? [photoUri] : undefined,
        };

        const newObservation = await createNewObservation(observationData);
        console.log('Observation créée:', newObservation);

        Alert.alert('Succès', 'Observation créée avec succès !', [
          { text: 'OK', onPress: handleClose },
        ]);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const action = isEditing ? 'modifier' : 'créer';
      Alert.alert('Erreur', `Impossible de ${action} l'observation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlay} onPress={handleClose} activeOpacity={1}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>{isEditing ? 'Modifier Observation' : 'Nouvelle Observation'}</Text>
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
              {/* Zone photo circulaire */}
              <View style={styles.photoSection}>
                <TouchableOpacity style={styles.photoContainer} onPress={handleTakePhoto}>
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photoImage} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoPlaceholderText}>📷</Text>
                      <Text style={styles.photoPlaceholderSubtext}>Prendre une photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Champ Nom (espèce) */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  ref={speciesInputRef}
                  style={styles.input}
                  value={formData.species}
                  onChangeText={(text) => setFormData({ ...formData, species: text })}
                  placeholder="Ex: Feuille jaune, Renard roux..."
                  placeholderTextColor="#999"
                  autoFocus={true}
                />
              </View>

              {/* Champ Date d'observation */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Date d'observation</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setIsDatePickerOpen(true)}
                >
                  <Text style={styles.dateText}>
                    {new Date(date).toLocaleDateString('fr-FR')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.saveButton, (isLoading || (!createNewObservation && !updateObservation)) && styles.saveButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isLoading || (!createNewObservation && !updateObservation)}
                >
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Enregistrement...' : (!createNewObservation && !updateObservation) ? 'Chargement...' : 'Enregistrer'}
                  </Text>
                </TouchableOpacity>

                {isEditing && (
                  <TouchableOpacity
                    style={[styles.deleteButton, isLoading && styles.deleteButtonDisabled]}
                    onPress={handleDelete}
                    disabled={isLoading}
                  >
                    <Text style={styles.deleteButtonText}>
                      {isLoading ? 'Suppression...' : 'Supprimer'}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        open={isDatePickerOpen}
        date={date}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        mode="date"
        locale="fr"
        title="Sélectionner une date"
        confirmText="Confirmer"
        cancelText="Annuler"
      />
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
    alignItems: 'center',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: 30,
    marginBottom: 5,
  },
  photoPlaceholderSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
    width: '100%',
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
    width: '100%',
    gap: 12,
    paddingTop: 20,
    paddingBottom: 20,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  deleteButton: {
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButtonDisabled: {
    backgroundColor: '#ccc',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
});