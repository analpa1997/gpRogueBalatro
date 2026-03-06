// Game state and core types
export interface GameState {
  currentCircuit: Circuit;
  playerCar: Car;
  playerDriver: Driver;
  resources: Resources;
  completedCircuits: CircuitResult[];
  currentRun: GameRun;
}

export interface GameRun {
  difficulty: number;
  circuitsSeed: number;
  upgrdesObtained: Upgrade[];
  currentCircuitIndex: number;
}

// Car component system
export interface CarComponent {
  id: string;
  name: string;
  tier: number;
  stats: CarStats;
  description: string;
  icon: string;
}

export interface Car {
  components: {
    engine: CarComponent;
    suspension: CarComponent;
    tires: CarComponent;
    aerodynamics: CarComponent;
    brakes: CarComponent;
  };
  totalStats: CarStats;
}

export interface CarStats {
  topSpeed: number;
  acceleration: number;
  handling: number;
  braking: number;
  stability: number;
  durability: number;
}

// Driver system
export interface DriverSkill {
  id: string;
  name: string;
  level: number;
  description: string;
  bonusStats: Partial<CarStats>;
}

export interface Driver {
  name: string;
  level: number;
  experience: number;
  skills: DriverSkill[];
  stats: DriverStats;
}

export interface DriverStats {
  cornering: number;
  braking: number;
  acceleration: number;
  consistency: number;
  riskTaking: number;
}

// Circuit system
export interface Circuit {
  id: string;
  name: string;
  difficulty: number;
  length: number;
  sections: CircuitSection[];
  boss?: BossData;
  baseTargetLapTime: number;
}

export interface CircuitSection {
  type: 'straight' | 'slowCorner' | 'fastCorner' | 'technical' | 'mixed';
  difficulty: number;
  length: number;
  weather?: WeatherType;
}

export interface BossData {
  name: string;
  drivingStyle: {
    aggressiveness: number;
    riskTaking: number;
    consistency: number;
  };
  carStats: CarStats;
}

export interface CircuitResult {
  circuitId: string;
  completed: boolean;
  playerLapTime: number;
  targetLapTime: number;
  bossLapTime?: number;
  difficulty: number;
  rewardsEarned: Resources;
}

// Upgrade system
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  type: 'car' | 'driver';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  cost: Resources;
  effect: UpgradeEffect;
  icon: string;
}

export interface UpgradeEffect {
  statModifiers?: Partial<CarStats>;
  newSkill?: DriverSkill;
  componentUpgrade?: CarComponent;
  specialAbility?: string;
}

// Resource system
export interface Resources {
  credits: number;
  blueprints: number;
  reputation: number;
}

// Procedural generation parameters
export interface GenerationParameters {
  circuitDifficulty: number;
  varietyLevel: number;
  weatherChance: number;
  bossFrequency: number;
  sectionVariety: number;
}

export interface ProceduralCircuitConfig {
  seed: number;
  difficulty: number;
  minSections: number;
  maxSections: number;
  parameters: GenerationParameters;
}

export type WeatherType = 'dry' | 'wet' | 'rainy' | 'fog';

// UI/Game flow types
export enum GameScene {
  MENU = 'menu',
  GARAGE = 'garage',
  CIRCUIT = 'circuit',
  RACE = 'race',
  UPGRADES = 'upgrades',
  RESULTS = 'results',
  MAP = 'map'
}

export interface UIState {
  currentScene: GameScene;
  selectedComponent?: string;
  selectedUpgrade?: string;
  isLoading: boolean;
}
