import type { Circuit, CircuitSection, CarStats, DriverStats } from '../../types';
import { WEATHER_EFFECTS } from '../../constants';

/**
 * Race simulation engine for calculating realistic lap times
 */
export class RaceSimulation {
  /**
   * Calculate lap time based on car stats, driver skills, and circuit characteristics
   */
  static calculateLapTime(
    circuit: Circuit,
    carStats: CarStats,
    driverStats: DriverStats
  ): number {
    let totalTime = 0;

    for (const section of circuit.sections) {
      totalTime += this.calculateSectionTime(section, carStats, driverStats);
    }

    return Math.round(totalTime * 10) / 10;
  }

  /**
   * Calculate time for a single circuit section
   */
  private static calculateSectionTime(
    section: CircuitSection,
    carStats: CarStats,
    driverStats: DriverStats
  ): number {
    // Base time calculation based on section type
    const baseTimePerKm = this.getBaseTimePerKm(section.type);
    let sectionDistance = section.length / 1000; // Convert to km

    // Calculate base driving time
    let drivingTime = sectionDistance * baseTimePerKm;

    // Apply car performance factor
    const carPerformanceFactor = this.calculateCarPerformance(
      section.type,
      carStats
    );
    drivingTime *= carPerformanceFactor;

    // Apply driver skill factor
    const driverSkillFactor = this.calculateDriverSkill(
      section.type,
      driverStats
    );
    drivingTime *= driverSkillFactor;

    // Apply difficulty modifier
    const difficultyModifier = 1 + section.difficulty * 0.15;
    drivingTime *= difficultyModifier;

    // Apply weather effects
    if (section.weather && section.weather !== 'dry') {
      const weatherModifier = this.getWeatherModifier(section.type, section.weather);
      drivingTime *= weatherModifier;
    }

    // Add consistency variation (driver consistency affects time variation)
    const consistencyBonus = 1 - (driverStats.consistency / 100) * 0.05;
    drivingTime *= consistencyBonus;

    return drivingTime;
  }

  /**
   * Get base time per km for different section types (in seconds)
   */
  private static getBaseTimePerKm(type: CircuitSection['type']): number {
    const baseTimes: Record<CircuitSection['type'], number> = {
      straight: 25, // Fastest section type
      fastCorner: 35,
      slowCorner: 45,
      technical: 50, // Slowest - most technical
      mixed: 40
    };
    return baseTimes[type];
  }

  /**
   * Calculate car performance factor (0.7 - 1.3)
   * Lower is better (faster)
   */
  private static calculateCarPerformance(
    sectionType: CircuitSection['type'],
    carStats: CarStats
  ): number {
    let factor = 1.0;

    switch (sectionType) {
      case 'straight':
        // Top speed and acceleration matter
        const topSpeedFactor = 1 - Math.min(carStats.topSpeed, 370) / 370 * 0.2;
        const accelFactor = 1 - Math.min(carStats.acceleration, 120) / 120 * 0.1;
        factor = topSpeedFactor * 0.7 + accelFactor * 0.3;
        break;

      case 'fastCorner':
        // Handling and speed matter
        const handlingFactor = 1 - Math.min(carStats.handling, 100) / 100 * 0.15;
        const speedFactor = 1 - Math.min(carStats.topSpeed, 370) / 370 * 0.1;
        factor = handlingFactor * 0.6 + speedFactor * 0.4;
        break;

      case 'slowCorner':
        // Handling and stability matter
        const slowHandling = 1 - Math.min(carStats.handling, 100) / 100 * 0.12;
        const stableFactor = 1 - Math.min(carStats.stability, 100) / 100 * 0.08;
        factor = slowHandling * 0.7 + stableFactor * 0.3;
        break;

      case 'technical':
        // All stats matter equally
        const techHandling = 1 - Math.min(carStats.handling, 100) / 100 * 0.1;
        const techStability = 1 - Math.min(carStats.stability, 100) / 100 * 0.1;
        const techBraking = 1 - Math.min(carStats.braking, 100) / 100 * 0.1;
        factor = (techHandling + techStability + techBraking) / 3;
        break;

      case 'mixed':
        // Average of all
        const mixedFactor =
          (1 - Math.min(carStats.topSpeed, 370) / 370 * 0.08) * 0.25 +
          (1 - Math.min(carStats.handling, 100) / 100 * 0.1) * 0.35 +
          (1 - Math.min(carStats.stability, 100) / 100 * 0.08) * 0.25 +
          (1 - Math.min(carStats.acceleration, 120) / 120 * 0.08) * 0.15;
        factor = mixedFactor;
        break;
    }

    return Math.max(0.7, Math.min(1.3, factor));
  }

  /**
   * Calculate driver skill factor (0.8 - 1.05)
   * Lower is better (faster)
   */
  private static calculateDriverSkill(
    sectionType: CircuitSection['type'],
    driverStats: DriverStats
  ): number {
    let factor = 1.0;

    switch (sectionType) {
      case 'straight':
        factor = 1 - Math.min(driverStats.acceleration, 100) / 100 * 0.05;
        break;

      case 'fastCorner':
        factor = 1 - Math.min(driverStats.cornering, 100) / 100 * 0.08;
        break;

      case 'slowCorner':
        factor = 1 - Math.min(driverStats.cornering, 100) / 100 * 0.06;
        break;

      case 'technical':
        // Consistency and cornering matter more
        const techCornering = Math.min(driverStats.cornering, 100) / 100;
        const techConsistency = Math.min(driverStats.consistency, 100) / 100;
        factor = 1 - (techCornering * 0.06 + techConsistency * 0.04);
        break;

      case 'mixed':
        // Average of cornering and acceleration
        const mixedCorner = Math.min(driverStats.cornering, 100) / 100;
        const mixedAccel = Math.min(driverStats.acceleration, 100) / 100;
        factor = 1 - (mixedCorner * 0.04 + mixedAccel * 0.03);
        break;
    }

    return Math.max(0.8, Math.min(1.05, factor));
  }

  /**
   * Get weather modifier for lap time
   */
  private static getWeatherModifier(
    sectionType: CircuitSection['type'],
    weather: string
  ): number {
    const weatherData = WEATHER_EFFECTS[weather as keyof typeof WEATHER_EFFECTS];
    if (!weatherData) return 1.0;

    // Different sections are affected differently by weather
    if (sectionType === 'straight') {
      // Straights are affected less by weather
      return 1 + (1 - weatherData.traction) * 0.05;
    } else if (sectionType === 'fastCorner') {
      // Fast corners very sensitive to weather
      return 1 + (1 - weatherData.traction) * 0.15;
    } else if (sectionType === 'slowCorner') {
      // Slow corners moderately affected
      return 1 + (1 - weatherData.traction) * 0.08;
    } else if (sectionType === 'technical') {
      // Technical sections very sensitive
      return 1 + (1 - weatherData.traction) * 0.12;
    } else {
      // Mixed
      return 1 + (1 - weatherData.traction) * 0.1;
    }
  }

  /**
   * Calculate boss lap time based on their stats and the circuit
   */
  static calculateBossLapTime(circuit: Circuit): number {
    if (!circuit.boss) {
      return circuit.baseTargetLapTime;
    }

    // Boss has variable performance based on their stats
    const bossConsistency = circuit.boss.drivingStyle.consistency;
    const bossRiskTaking = circuit.boss.drivingStyle.riskTaking;

    // Higher consistency = lower time, but risk taking also helps
    const performanceBonus = bossConsistency * 0.15 + bossRiskTaking * 0.1;
    const bossLapTime = circuit.baseTargetLapTime * (0.85 + performanceBonus);

    return Math.round(bossLapTime * 10) / 10;
  }

  /**
   * Calculate difficulty rating (0-1) for a circuit
   */
  static calculateCircuitDifficulty(circuit: Circuit): number {
    const avgSectionDifficulty =
      circuit.sections.reduce((sum, s) => sum + s.difficulty, 0) /
      circuit.sections.length;

    const weatherDifficulty = circuit.sections.filter(
      s => s.weather && s.weather !== 'dry'
    ).length / circuit.sections.length * 0.15;

    const bossDifficulty = circuit.boss ? 0.2 : 0;

    return Math.min(1, avgSectionDifficulty + weatherDifficulty + bossDifficulty);
  }
}
