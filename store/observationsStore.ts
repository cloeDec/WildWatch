import { Observation } from '../types/observation';

// Stockage global partagé
class ObservationsStore {
  private observations: Observation[] = [];
  private listeners: ((observations: Observation[]) => void)[] = [];

  // Ajouter une observation
  addObservation(observation: Observation) {
    console.log('ObservationsStore: Ajout observation:', observation.id);
    this.observations = [observation, ...this.observations];
    this.notifyListeners();
  }

  // Obtenir toutes les observations
  getObservations(): Observation[] {
    return [...this.observations];
  }

  // S'abonner aux changements
  subscribe(listener: (observations: Observation[]) => void) {
    console.log('ObservationsStore: Nouvel abonné');
    this.listeners.push(listener);

    // Retourner une fonction de désabonnement
    return () => {
      console.log('ObservationsStore: Désabonnement');
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notifier tous les listeners
  private notifyListeners() {
    console.log('ObservationsStore: Notification de', this.listeners.length, 'listeners');
    console.log('ObservationsStore: Total observations:', this.observations.length);

    this.listeners.forEach(listener => {
      try {
        listener([...this.observations]);
      } catch (error) {
        console.error('ObservationsStore: Erreur dans listener:', error);
      }
    });
  }

  // Méthode pour débug
  getStats() {
    return {
      observationsCount: this.observations.length,
      listenersCount: this.listeners.length,
    };
  }
}

// Instance globale
export const observationsStore = new ObservationsStore();