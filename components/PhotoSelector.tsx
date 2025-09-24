import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

interface PhotoSelectorProps {
  photoUri: string | null;
  onTakePhoto: () => void;
}

const availableImages = [
  { id: 'raccoon', source: require("../assets/images/raccoon.png") },
  { id: 'fleur1', source: require("../assets/images/thumb_fleur-printemps-rose-6153.jpg") },
  { id: 'fleur2', source: require("../assets/images/osteospermum-istock.jpg") },
  { id: 'fleur3', source: require("../assets/images/QJ2GDGC4DZFIRLOR4XYNNVENQA.jpg") },
];

const getImageSource = (photoUri: string) => {
  if (photoUri.startsWith('asset://raccoon')) return require("../assets/images/raccoon.png");
  if (photoUri.startsWith('asset://fleur1')) return require("../assets/images/thumb_fleur-printemps-rose-6153.jpg");
  if (photoUri.startsWith('asset://fleur2')) return require("../assets/images/osteospermum-istock.jpg");
  if (photoUri.startsWith('asset://fleur3')) return require("../assets/images/QJ2GDGC4DZFIRLOR4XYNNVENQA.jpg");
  if (photoUri.startsWith('camera://simulation')) return require("../assets/images/raccoon.png");
  return { uri: photoUri };
};

export const PhotoSelector: React.FC<PhotoSelectorProps> = ({
  photoUri,
  onTakePhoto,
}) => {
  const handlePress = () => {
    console.log('PhotoSelector: Clic détecté');
    onTakePhoto();
  };

  return (
    <View style={styles.photoSection}>
      <TouchableOpacity
        style={styles.photoContainer}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {photoUri ? (
          <Image
            source={getImageSource(photoUri)}
            style={styles.photoImage}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>📷</Text>
            <Text style={styles.photoPlaceholderSubtext}>Prendre une photo</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});