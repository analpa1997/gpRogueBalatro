import {
  Circuit,
  CircuitSection,
  BossData,
  ProceduralCircuitConfig,
  WeatherType
} from '../types';
import {
  CIRCUIT_GEN_CONSTANTS,
  GENERATION_PARAMS_BY_DIFFICULTY,
  BOSS_CONFIGS,
  WEATHER_EFFECTS
} from '../constants';
import { SeededRandom, ProceduralUtils } from '../utils/procedural';

export class ProceduralCircuitGenerator {
  /**
   * Generate a complete circuit with all its properties
   */
  static generateCircuit(config: ProceduralCircuitConfig, index: number): Circuit {
    const seed = ProceduralUtils.hashParameters(
      config.difficulty,
      config.seed,
      index
    );
    const rng = new SeededRandom(seed);
    const params = GENERATION_PARAMS_BY_DIFFICULTY[config.difficulty] || GENERATION_PARAMS_BY_DIFFICULTY[5];

    // Generate basic circuit characteristics
    const numSections = rng.nextInt(config.minSections, config.maxSections);
    const sections = this.generateSections(rng, numSections, params, config.difficulty);
    
    // Calculate circuit properties
    const length = sections.reduce((sum, s) => sum + s.length, 0);
    const baseTargetLapTime = this.calculateTargetLapTime(
      length,
      sections,
      config.difficulty
    );

    // Decide if circuit has a boss
    const hasBoss = rng.next() < params.bossFrequency;
    const boss = hasBoss ? this.generateBoss(rng, config.difficulty) : undefined;

    return {
      id: `circuit_${config.seed}_${index}`,
      name: this.generateCircuitName(rng),
      difficulty: config.difficulty,
      length,
      sections,
      boss,
      baseTargetLapTime
    };
  }

  /**
   * Generate circuit sections
   */
  private static generateSections(
    rng: SeededRandom,
    count: number,
    params: typeof GENERATION_PARAMS_BY_DIFFICULTY[1],
    difficulty: number
  ): CircuitSection[] {
    const sections: CircuitSection[] = [];
    const sectionTypes = CIRCUIT_GEN_CONSTANTS.SECTION_TYPES;

    for (let i = 0; i < count; i++) {
      const type = rng.choice(sectionTypes);
      
      // Base difficulty varies by difficulty level
      const baseDifficulty = ProceduralUtils.lerp(0.2, 1.0, difficulty / 5);
      const variance = (rng.next() - 0.5) * params.varietyLevel;
      const sectionDifficulty = ProceduralUtils.clamp(
        baseDifficulty + variance,
        0.1,
        1.0
      );

      // Length varies by section type
      const lengthMultiplier = this.getSectionLengthMultiplier(type);
      const baseLength = 1000 + rng.nextInt(-200, 200);
      const length = baseLength * lengthMultiplier;

      // Weather chance
      const weather = rng.next() < params.weatherChance
        ? rng.choice(['dry', 'wet', 'rainy', 'fog'] as WeatherType[])
        : 'dry';

      sections.push({
        type,
        difficulty: sectionDifficulty,
        length,
        weather
      });
    }

    return sections;
  }

  /**
   * Get length multiplier based on section type
   */
  private static getSectionLengthMultiplier(type: CircuitSection['type']): number {
    const multipliers: Record<CircuitSection['type'], number> = {
      straight: 1.2,
      slowCorner: 0.8,
      fastCorner: 0.9,
      technical: 0.7,
      mixed: 1.0
    };
    return multipliers[type];
  }

  /**
   * Calculate target lap time based on circuit characteristics
   */
  private static calculateTargetLapTime(
    length: number,
    sections: CircuitSection[],
    difficulty: number
  ): number {
    const baseLapTime = CIRCUIT_GEN_CONSTANTS.BASE_LAP_TIME;
    const lengthFactor = length / 5000; // Normalize by typical circuit length
    const difficultyFactor = ProceduralUtils.lerp(0.8, 1.3, difficulty / 5);
    
    // Average section difficulty affects time
    const avgSectionDifficulty = sections.reduce((sum, s) => sum + s.difficulty, 0) / sections.length;
    const sectionFactor = 0.9 + avgSectionDifficulty * 0.2;

    const calculatedTime = baseLapTime * lengthFactor * difficultyFactor * sectionFactor;
    
    return ProceduralUtils.clamp(
      calculatedTime,
      CIRCUIT_GEN_CONSTANTS.MIN_LAP_TIME,
      CIRCUIT_GEN_CONSTANTS.MAX_LAP_TIME
    );
  }

  /**
   * Generate a boss for the circuit
   */
  private static generateBoss(rng: SeededRandom, difficulty: number): BossData {
    const bossTemplate = BOSS_CONFIGS[difficulty] || BOSS_CONFIGS[5];
    
    // Add some variation to boss stats
    const variation = 0.85 + rng.next() * 0.3; // 0.85 to 1.15x
    
    return {
      name: bossTemplate.name,
      drivingStyle: {
        aggressiveness: ProceduralUtils.clamp(
          bossTemplate.drivingStyle.aggressiveness + (rng.next() - 0.5) * 0.1,
          0,
          1
        ),
        riskTaking: ProceduralUtils.clamp(
          bossTemplate.drivingStyle.riskTaking + (rng.next() - 0.5) * 0.1,
          0,
          1
        ),
        consistency: ProceduralUtils.clamp(
          bossTemplate.drivingStyle.consistency + (rng.next() - 0.5) * 0.05,
          0,
          1
        )
      },
      carStats: Object.entries(bossTemplate.carStats).reduce((acc, [key, value]) => {
        acc[key as keyof typeof value] = Math.floor(value * variation) as any;
        return acc;
      }, {} as BossData['carStats'])
    };
  }

  /**
   * Generate a unique circuit name
   */
  private static generateCircuitName(rng: SeededRandom): string {
    const adjectives = [
      'Grand', 'Royal', 'Pacific', 'Alpine', 'Desert', 'Arctic',
      'Urban', 'Coastal', 'Mountain', 'Ancient', 'Modern', 'Thunder'
    ];
    const nouns = [
      'Prix', 'Circuit', 'Speedway', 'Track', 'Raceway', 'Challenge',
      'Cup', 'Classic', 'Dash', 'Run', 'Marathon', 'Rally'
    ];

    const adjective = rng.choice(adjectives);
    const noun = rng.choice(nouns);
    return `${adjective} ${noun}`;
  }

  /**
   * Generate multiple circuits for a run
   */
  static generateRunCircuits(
    config: ProceduralCircuitConfig,
    count: number = 5
  ): Circuit[] {
    const circuits: Circuit[] = [];
    for (let i = 0; i < count; i++) {
      circuits.push(this.generateCircuit(config, i));
    }
    return circuits;
  }
}
