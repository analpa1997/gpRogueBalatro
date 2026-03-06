/**
 * Seeded random number generator for consistent procedural generation
 * Uses xorshift32 algorithm for good distribution
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed | 0;
  }

  next(): number {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return ((this.seed >>> 0) / 4294967296) * 0.9999999;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  choice<T>(array: T[]): T {
    const index = this.nextInt(0, array.length - 1);
    return array[index];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  weightedChoice<T>(items: Array<{ item: T; weight: number }>): T {
    const total = items.reduce((sum, { weight }) => sum + weight, 0);
    let random = this.next() * total;
    
    for (const { item, weight } of items) {
      random -= weight;
      if (random <= 0) return item;
    }
    
    return items[items.length - 1].item;
  }
}

/**
 * Utility functions for procedural generation
 */
export const ProceduralUtils = {
  /**
   * Generate a unique hash from parameters for reproducible generation
   */
  hashParameters: (difficulty: number, runSeed: number, index: number): number => {
    let hash = runSeed;
    hash = ((hash << 5) - hash) + difficulty;
    hash = ((hash << 5) - hash) + index;
    return hash >>> 0;
  },

  /**
   * Lerp (linear interpolation) between two values
   */
  lerp: (a: number, b: number, t: number): number => {
    return a + (b - a) * Math.max(0, Math.min(1, t));
  },

  /**
   * Clamp a value between min and max
   */
  clamp: (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
  },

  /**
   * Perlin-like noise for smooth variation
   */
  smoothstep: (t: number): number => {
    return t * t * (3 - 2 * t);
  },

  /**
   * Generate difficulty curve based on progression
   */
  getDifficultyMultiplier: (currentDifficulty: number, maxDifficulty: number = 5): number => {
    return ProceduralUtils.lerp(0.8, 1.2, currentDifficulty / maxDifficulty);
  }
};
