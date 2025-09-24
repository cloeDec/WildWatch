import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface ObservationFormProps {
  species: string;
  onSpeciesChange: (text: string) => void;
  date: Date;
  onDatePress: () => void;
}

export const ObservationForm: React.FC<ObservationFormProps> = ({
  species,
  onSpeciesChange,
  date,
  onDatePress,
}) => {
  const speciesInputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      speciesInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          ref={speciesInputRef}
          style={styles.input}
          value={species}
          onChangeText={onSpeciesChange}
          placeholder="Ex: Feuille jaune, Renard roux..."
          placeholderTextColor="#999"
          autoFocus={true}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date d'observation</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={onDatePress}
        >
          <Text style={styles.dateText}>
            {date.toLocaleDateString('fr-FR')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
});