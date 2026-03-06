import type { Circuit } from '../../types';
import { RaceSimulation } from '../circuit-system/raceSimulation';

/**
 * Circuit manager - handles circuit generation and retrievalfor a run
 */
export class CircuitManager {
  private circuits: Circuit[] = [];
  private currentCircuitIndex = 0;

  /**
   * Initialize with generated circuits
   */
  setCircuits(circuits: Circuit[]): void {
    this.circuits = circuits;
    this.currentCircuitIndex = 0;
  }

  /**
   * Get current circuit
   */
  getCurrentCircuit(): Circuit | null {
    if (this.currentCircuitIndex >= this.circuits.length) {
      return null;
    }
    return this.circuits[this.currentCircuitIndex];
  }

  /**
   * Get all circuits
   */
  getAllCircuits(): Circuit[] {
    return this.circuits;
  }

  /**
   * Get circuit by index
   */
  getCircuit(index: number): Circuit | null {
    if (index < 0 || index >= this.circuits.length) {
      return null;
    }
    return this.circuits[index];
  }

  /**
   * Advance to next circuit
   */
  nextCircuit(): boolean {
    if (this.currentCircuitIndex < this.circuits.length - 1) {
      this.currentCircuitIndex++;
      return true;
    }
    return false;
  }

  /**
   * Get circuit progress
   */
  getProgress(): { current: number; total: number } {
    return {
      current: this.currentCircuitIndex + 1,
      total: this.circuits.length
    };
  }

  /**
   * Get difficulty rating of the circuit
   */
  getCircuitDifficulty(circuit: Circuit): number {
    return RaceSimulation.calculateCircuitDifficulty(circuit);
  }

  /**
   * Get circuit description/info string
   */
  getCircuitInfo(circuit: Circuit): string {
    const difficulty = this.getCircuitDifficulty(circuit);
    const difficultyLabel = this.getDifficultyLabel(difficulty);

    let info = `${circuit.name} - ${difficultyLabel}\n`;
    info += `Length: ${(circuit.length / 1000).toFixed(2)}km\n`;
    info += `Sections: ${circuit.sections.length}\n`;
    info += `Target Lap Time: ${circuit.baseTargetLapTime.toFixed(1)}s`;

    if (circuit.boss) {
      info += `\nBoss: ${circuit.boss.name}`;
    }

    return info;
  }

  /**
   * Get difficulty label
   */
  private getDifficultyLabel(difficulty: number): string {
    if (difficulty < 0.2) return 'Easy';
    if (difficulty < 0.4) return 'Medium';
    if (difficulty < 0.6) return 'Hard';
    if (difficulty < 0.8) return 'Very Hard';
    return 'Extreme';
  }
}
