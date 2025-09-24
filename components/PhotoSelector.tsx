import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface PhotoSelectorProps {
  photoUri: string | null;
  onTakePhoto: () => void;
}


export const PhotoSelector: React.FC<PhotoSelectorProps> = ({
  photoUri,
  onTakePhoto,
}) => {
  return (
    <View style={styles.photoSection}>
      <TouchableOpacity
        style={styles.photoContainer}
        onPress={onTakePhoto}
        activeOpacity={0.7}
      >
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
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