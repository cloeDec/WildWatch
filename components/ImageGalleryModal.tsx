import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
} from 'react-native';

const availableImages = [
  { id: 'raccoon', source: require("../assets/images/raccoon.png") },
  { id: 'fleur1', source: require("../assets/images/thumb_fleur-printemps-rose-6153.jpg") },
  { id: 'fleur2', source: require("../assets/images/osteospermum-istock.jpg") },
  { id: 'fleur3', source: require("../assets/images/QJ2GDGC4DZFIRLOR4XYNNVENQA.jpg") },
];

interface ImageGalleryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (imageData: { id: string; source: any }) => void;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  visible,
  onClose,
  onSelectImage,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Choisir une image</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={availableImages}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.imageGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.imageOption}
                onPress={() => onSelectImage(item)}
              >
                <Image source={item.source} style={styles.imageOptionImage} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    maxHeight: '70%',
    minWidth: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
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
  imageGrid: {
    padding: 20,
  },
  imageOption: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
  },
  imageOptionImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
});