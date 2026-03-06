import { CarComponent, BossData, Resources, GenerationParameters } from '../types';

// Career difficulty progression
export const DIFFICULTY_LEVELS = {
  ROOKIE: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
  LEGENDARY: 5
} as const;

// Base car components
export const BASE_CAR_COMPONENTS: Record<string, CarComponent> = {
  engine: {
    id: 'engine_base',
    name: 'Standard Engine',
    tier: 1,
    stats: {
      topSpeed: 300,
      acceleration: 80,
      handling: 0,
      braking: 0,
      stability: 0,
      durability: 8
    },
    description: 'A reliable baseline engine',
    icon: 'engine'
  },
  suspension: {
    id: 'suspension_base',
    name: 'Standard Suspension',
    tier: 1,
    stats: {
      topSpeed: 0,
      acceleration: 0,
      handling: 75,
      braking: 0,
      stability: 70,
      durability: 8
    },
    description: 'Balanced suspension setup',
    icon: 'suspension'
  },
  tires: {
    id: 'tires_base',
    name: 'All-Weather Tires',
    tier: 1,
    stats: {
      topSpeed: 0,
      acceleration: 60,
      handling: 80,
      braking: 70,
      stability: 65,
      durability: 6
    },
    description: 'Good all-around tire choice',
    icon: 'tires'
  },
  aerodynamics: {
    id: 'aero_base',
    name: 'Standard Aerodynamics',
    tier: 1,
    stats: {
      topSpeed: 50,
      acceleration: 0,
      handling: 50,
      braking: 0,
      stability: 40,
      durability: 10
    },
    description: 'Balanced aerodynamic package',
    icon: 'aerodynamics'
  },
  brakes: {
    id: 'brakes_base',
    name: 'Standard Brakes',
    tier: 1,
    stats: {
      topSpeed: 0,
      acceleration: 0,
      handling: 0,
      braking: 75,
      stability: 0,
      durability: 8
    },
    description: 'Reliable braking system',
    icon: 'brakes'
  }
};

// Upgrade rarity weights for procedural generation
export const RARITY_WEIGHTS = {
  common: 0.5,
  uncommon: 0.25,
  rare: 0.15,
  epic: 0.08,
  legendary: 0.02
} as const;

// Generation parameters by difficulty
export const GENERATION_PARAMS_BY_DIFFICULTY: Record<number, GenerationParameters> = {
  1: {
    circuitDifficulty: 0.3,
    varietyLevel: 0.3,
    weatherChance: 0.1,
    bossFrequency: 0.2,
    sectionVariety: 0.3
  },
  2: {
    circuitDifficulty: 0.5,
    varietyLevel: 0.5,
    weatherChance: 0.3,
    bossFrequency: 0.4,
    sectionVariety: 0.5
  },
  3: {
    circuitDifficulty: 0.65,
    varietyLevel: 0.7,
    weatherChance: 0.5,
    bossFrequency: 0.6,
    sectionVariety: 0.7
  },
  4: {
    circuitDifficulty: 0.8,
    varietyLevel: 0.85,
    weatherChance: 0.7,
    bossFrequency: 0.8,
    sectionVariety: 0.85
  },
  5: {
    circuitDifficulty: 1.0,
    varietyLevel: 1.0,
    weatherChance: 0.9,
    bossFrequency: 1.0,
    sectionVariety: 1.0
  }
};

// Boss characteristics by difficulty
export const BOSS_CONFIGS: Record<number, BossData> = {
  1: {
    name: 'Amateur Rival',
    drivingStyle: {
      aggressiveness: 0.3,
      riskTaking: 0.2,
      consistency: 0.6
    },
    carStats: {
      topSpeed: 280,
      acceleration: 70,
      handling: 70,
      braking: 70,
      stability: 65,
      durability: 8
    }
  },
  2: {
    name: 'Pro Driver',
    drivingStyle: {
      aggressiveness: 0.5,
      riskTaking: 0.4,
      consistency: 0.75
    },
    carStats: {
      topSpeed: 310,
      acceleration: 85,
      handling: 80,
      braking: 80,
      stability: 75,
      durability: 9
    }
  },
  3: {
    name: 'Championship Contender',
    drivingStyle: {
      aggressiveness: 0.65,
      riskTaking: 0.6,
      consistency: 0.85
    },
    carStats: {
      topSpeed: 330,
      acceleration: 95,
      handling: 90,
      braking: 90,
      stability: 85,
      durability: 10
    }
  },
  4: {
    name: 'Legend',
    drivingStyle: {
      aggressiveness: 0.8,
      riskTaking: 0.75,
      consistency: 0.9
    },
    carStats: {
      topSpeed: 350,
      acceleration: 105,
      handling: 100,
      braking: 100,
      stability: 95,
      durability: 11
    }
  },
  5: {
    name: 'The Ultimate Champion',
    drivingStyle: {
      aggressiveness: 0.95,
      riskTaking: 0.9,
      consistency: 0.95
    },
    carStats: {
      topSpeed: 370,
      acceleration: 115,
      handling: 110,
      braking: 110,
      stability: 105,
      durability: 12
    }
  }
};

// Starting resources by difficulty
export const STARTING_RESOURCES: Record<number, Resources> = {
  1: { credits: 10000, blueprints: 50, reputation: 100 },
  2: { credits: 8000, blueprints: 40, reputation: 75 },
  3: { credits: 6000, blueprints: 30, reputation: 50 },
  4: { credits: 4000, blueprints: 20, reputation: 25 },
  5: { credits: 2000, blueprints: 10, reputation: 10 }
};

// Circuit generation constants
export const CIRCUIT_GEN_CONSTANTS = {
  MIN_SECTIONS: 3,
  MAX_SECTIONS: 8,
  SECTION_TYPES: ['straight', 'slowCorner', 'fastCorner', 'technical', 'mixed'] as const,
  BASE_LAP_TIME: 90, // in seconds
  MIN_LAP_TIME: 60,
  MAX_LAP_TIME: 180
};

// Weather effects on performance
export const WEATHER_EFFECTS = {
  dry: { traction: 1.0, downforce: 1.0, braking: 1.0 },
  wet: { traction: 0.7, downforce: 0.8, braking: 0.85 },
  rainy: { traction: 0.5, downforce: 0.6, braking: 0.75 },
  fog: { traction: 0.8, downforce: 0.9, braking: 0.9 }
};

// Game progression constants
export const GAME_PROGRESSION = {
  CIRCUITS_PER_SEASON: 5,
  MAX_SEASONS: 10,
  UPGRADE_CHOICES_PER_CIRCUIT: 3,
  XP_FOR_CIRCUIT_WIN: 1000,
  XP_FOR_CIRCUIT_LOSS: 200
};
