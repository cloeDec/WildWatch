import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { ActionButtons } from "../components/ActionButtons";
import { ImageGalleryModal } from "../components/ImageGalleryModal";
import { ObservationForm } from "../components/ObservationForm";
import { PhotoSelector } from "../components/PhotoSelector";
import { useObservationsStore } from "../hooks/useObservationsStore";
import { CreateObservationDto } from "../types/observation";

export default function ObservationModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
    observationId?: string;
  }>();

  const hookResult = useObservationsStore();

  const {
    createNewObservation,
    updateObservation,
    deleteObservation,
    observations,
    isLoading,
  } = hookResult || {};

  const [formData, setFormData] = useState({
    species: "",
    observationDate: new Date().toISOString().split("T")[0],
  });

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const latitude = params.latitude ? parseFloat(params.latitude) : 0;
  const longitude = params.longitude ? parseFloat(params.longitude) : 0;
  const observationId = params.observationId;
  const isEditing = !!observationId;

  const existingObservation = isEditing
    ? observations?.find((obs) => obs.id === observationId)
    : null;


  useEffect(() => {
    if (isEditing && existingObservation) {
      setFormData({
        species: existingObservation.species,
        observationDate: new Date(existingObservation.timestamp)
          .toISOString()
          .split("T")[0],
      });
      setDate(new Date(existingObservation.timestamp));
      if (existingObservation.photos && existingObservation.photos.length > 0) {
        setPhotoUri(existingObservation.photos[0]);
      }
    }
  }, [isEditing, existingObservation]);

  const handleClose = () => {
    router.back();
  };

  const handleTakePhoto = async () => {

    Alert.alert(
      "Choisir une photo",
      "Comment voulez-vous ajouter une photo ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Galerie", onPress: handlePickFromGallery },
        { text: "Caméra", onPress: handleLaunchCamera },
      ]
    );
  };

  const handleLaunchCamera = async () => {
    try {
      const simulatedPhotoUri = `camera://simulation_${Date.now()}`;
      setPhotoUri(simulatedPhotoUri);

      Alert.alert("Simulation", "Photo simulée prise avec la caméra!");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de simuler la caméra");
    }
  };

  const handlePickFromGallery = async () => {
    setIsImageSelectorOpen(true);
  };

  const handleSelectImage = (imageData: { id: string; source: any }) => {
    const imageUri = `asset://${imageData.id}`;
    setPhotoUri(imageUri);
    setIsImageSelectorOpen(false);
  };

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setFormData({
      ...formData,
      observationDate: selectedDate.toISOString().split("T")[0],
    });
    setIsDatePickerOpen(false);
  };

  const handleDateCancel = () => {
    setIsDatePickerOpen(false);
  };

  const handleDelete = async () => {

    if (!isEditing || !observationId || !deleteObservation) {
      return;
    }

    Alert.alert(
      "Supprimer l'observation",
      "Êtes-vous sûr de vouloir supprimer cette observation ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteObservation(observationId);

              Alert.alert("Succès", "Observation supprimée avec succès !", [
                { text: "OK", onPress: handleClose },
              ]);
            } catch (error) {
              Alert.alert(
                "Erreur",
                `Impossible de supprimer l'observation: ${
                  error instanceof Error ? error.message : "Erreur inconnue"
                }`
              );
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.species.trim()) {
      Alert.alert("Erreur", "Veuillez renseigner l'espèce observée");
      return;
    }

    if (!createNewObservation && !updateObservation) {
      Alert.alert(
        "Erreur",
        "Le système n'est pas encore prêt. Veuillez réessayer dans un moment."
      );
      return;
    }

    try {
      if (isEditing && existingObservation && updateObservation) {

        const updatedObservation = {
          ...existingObservation,
          species: formData.species.trim(),
          timestamp: date.getTime(),
          updatedAt: Date.now(),
          photos: photoUri ? [photoUri] : existingObservation.photos,
        };

        await updateObservation(updatedObservation);

        Alert.alert("Succès", "Observation modifiée avec succès !", [
          { text: "OK", onPress: handleClose },
        ]);
      } else if (!isEditing && createNewObservation) {

        const observationData: CreateObservationDto = {
          species: formData.species.trim(),
          latitude,
          longitude,
          accuracy: 5,
          photos: photoUri ? [photoUri] : undefined,
        };

        await createNewObservation(observationData);

        Alert.alert("Succès", "Observation créée avec succès !", [
          { text: "OK", onPress: handleClose },
        ]);
      }
    } catch (error) {
      const action = isEditing ? "modifier" : "créer";
      Alert.alert(
        "Erreur",
        `Impossible de ${action} l'observation: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    }
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlay}
          onPress={handleClose}
          activeOpacity={1}
        >
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {isEditing ? "Modifier Observation" : "Nouvelle Observation"}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={styles.scrollContent}
            >
              <PhotoSelector
                photoUri={photoUri}
                onTakePhoto={handleTakePhoto}
              />

              <ObservationForm
                species={formData.species}
                onSpeciesChange={(text) =>
                  setFormData({ ...formData, species: text })
                }
                date={date}
                onDatePress={() => setIsDatePickerOpen(true)}
              />

              <ActionButtons
                isLoading={isLoading}
                isEditing={isEditing}
                canSave={createNewObservation != null && updateObservation != null}
                onSave={handleSubmit}
                onDelete={isEditing ? handleDelete : undefined}
                onCancel={handleClose}
              />
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

      <ImageGalleryModal
        visible={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleSelectImage}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    marginTop: "20%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
});
