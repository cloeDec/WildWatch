import { Observation } from "../types/observation";

class ObservationsStore {
  private observations: Observation[] = [];
  private listeners: ((observations: Observation[]) => void)[] = [];

  addObservation(observation: Observation) {
    this.observations = [observation, ...this.observations];
    this.notifyListeners();
  }

  updateObservation(updatedObservation: Observation) {
    const index = this.observations.findIndex(
      (obs) => obs.id === updatedObservation.id
    );
    if (index !== -1) {
      this.observations[index] = updatedObservation;
      this.notifyListeners();
    } else {
    }
  }

  deleteObservation(observationId: string) {
    const initialLength = this.observations.length;
    this.observations = this.observations.filter(
      (obs) => obs.id !== observationId
    );

    if (this.observations.length < initialLength) {
      this.notifyListeners();
    } else {
    }
  }

  getObservations(): Observation[] {
    return [...this.observations];
  }

  subscribe(listener: (observations: Observation[]) => void) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener([...this.observations]);
      } catch (error) {}
    });
  }

  getStats() {
    return {
      observationsCount: this.observations.length,
      listenersCount: this.listeners.length,
    };
  }
}

export const observationsStore = new ObservationsStore();
