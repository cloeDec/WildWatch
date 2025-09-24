import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface ActionButtonsProps {
  isLoading: boolean;
  isEditing: boolean;
  canSave: boolean;
  onSave: () => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  isEditing,
  canSave,
  onSave,
  onDelete,
  onCancel,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.saveButton, (!canSave || isLoading) && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={!canSave || isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? 'Enregistrement...' : !canSave ? 'Chargement...' : 'Enregistrer'}
        </Text>
      </TouchableOpacity>

      {isEditing && onDelete && (
        <TouchableOpacity
          style={[styles.deleteButton, isLoading && styles.deleteButtonDisabled]}
          onPress={onDelete}
          disabled={isLoading}
        >
          <Text style={styles.deleteButtonText}>
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});