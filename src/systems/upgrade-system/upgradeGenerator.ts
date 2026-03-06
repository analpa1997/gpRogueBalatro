import type { Upgrade, Resources, UpgradeEffect } from '../../types';
import { RARITY_WEIGHTS } from '../../constants';
import { SeededRandom } from '../../utils/procedural';

interface UpgradeTemplate {
  name: string;
  description: string;
  rarityOverride?: string;
  effectGenerator: (rng: SeededRandom, rarity: string, difficulty: number) => UpgradeEffect;
  costCalculator: (rarity: string, difficulty: number) => Resources;
}

const UPGRADE_TEMPLATES: Record<string, UpgradeTemplate> = {
  engines: {
    name: 'Engine Upgrade',
    description: 'Improve your engine performance',
    effectGenerator: (rng, rarity) => ({
      statModifiers: {
        topSpeed: 10 + rng.nextInt(5, 20) * (rarity === 'legendary' ? 2 : 1),
        acceleration: 8 + rng.nextInt(4, 15) * (rarity === 'legendary' ? 1.5 : 1)
      }
    }),
    costCalculator: (rarity, difficulty) => {
      const baseCredits = 2000;
      const rarityMultipliers: Record<string, number> = {
        common: 1, uncommon: 1.5, rare: 2.5, epic: 4, legendary: 7
      };
      return {
        credits: Math.floor(baseCredits * rarityMultipliers[rarity] * (1 + difficulty / 5)),
        blueprints: Math.floor(10 * rarityMultipliers[rarity]),
        reputation: Math.floor(50 * rarityMultipliers[rarity])
      };
    }
  },
  suspension: {
    name: 'Suspension Upgrade',
    description: 'Enhance handling and stability',
    effectGenerator: (rng, rarity) => ({
      statModifiers: {
        handling: 12 + rng.nextInt(5, 18) * (rarity === 'legendary' ? 1.8 : 1),
        stability: 10 + rng.nextInt(5, 15) * (rarity === 'legendary' ? 1.5 : 1)
      }
    }),
    costCalculator: (rarity, difficulty) => {
      const baseCredits = 1800;
      const rarityMultipliers: Record<string, number> = {
        common: 1, uncommon: 1.5, rare: 2.5, epic: 4, legendary: 7
      };
      return {
        credits: Math.floor(baseCredits * rarityMultipliers[rarity] * (1 + difficulty / 5)),
        blueprints: Math.floor(8 * rarityMultipliers[rarity]),
        reputation: Math.floor(40 * rarityMultipliers[rarity])
      };
    }
  },
  tires: {
    name: 'Tire Upgrade',
    description: 'Better grip and performance',
    effectGenerator: (rng, rarity) => ({
      statModifiers: {
        braking: 8 + rng.nextInt(3, 12) * (rarity === 'legendary' ? 1.7 : 1),
        acceleration: 6 + rng.nextInt(2, 10) * (rarity === 'legendary' ? 1.5 : 1),
        handling: 5 + rng.nextInt(2, 8) * (rarity === 'legendary' ? 1.6 : 1)
      }
    }),
    costCalculator: (rarity, difficulty) => {
      const baseCredits = 1500;
      const rarityMultipliers: Record<string, number> = {
        common: 1, uncommon: 1.5, rare: 2.5, epic: 4, legendary: 7
      };
      return {
        credits: Math.floor(baseCredits * rarityMultipliers[rarity] * (1 + difficulty / 5)),
        blueprints: Math.floor(7 * rarityMultipliers[rarity]),
        reputation: Math.floor(35 * rarityMultipliers[rarity])
      };
    }
  },
  brakes: {
    name: 'Braking System Upgrade',
    description: 'Improve stopping power',
    effectGenerator: (rng, rarity) => ({
      statModifiers: {
        braking: 15 + rng.nextInt(8, 20) * (rarity === 'legendary' ? 2 : 1)
      }
    }),
    costCalculator: (rarity, difficulty) => {
      const baseCredits = 2000;
      const rarityMultipliers: Record<string, number> = {
        common: 1, uncommon: 1.5, rare: 2.5, epic: 4, legendary: 7
      };
      return {
        credits: Math.floor(baseCredits * rarityMultipliers[rarity] * (1 + difficulty / 5)),
        blueprints: Math.floor(9 * rarityMultipliers[rarity]),
        reputation: Math.floor(45 * rarityMultipliers[rarity])
      };
    }
  },
  driverSkill: {
    name: 'Driver Skill Training',
    description: 'Develop new driving techniques',
    effectGenerator: (rng, rarity) => ({
      newSkill: {
        id: `skill_${Date.now()}`,
        name: generateSkillName(rng),
        level: 1 + (rarity === 'legendary' ? 2 : rarity === 'epic' ? 1 : 0),
        description: 'A new driving technique',
        bonusStats: {
          topSpeed: rng.nextInt(5, 15) * (rarity === 'legendary' ? 2 : 1),
          handling: rng.nextInt(5, 15) * (rarity === 'legendary' ? 1.8 : 1)
        }
      }
    }),
    costCalculator: (rarity, difficulty) => {
      const baseCredits = 1200;
      const rarityMultipliers: Record<string, number> = {
        common: 1, uncommon: 1.5, rare: 2.5, epic: 4, legendary: 7
      };
      return {
        credits: Math.floor(baseCredits * rarityMultipliers[rarity] * (1 + difficulty / 5)),
        blueprints: Math.floor(5 * rarityMultipliers[rarity]),
        reputation: Math.floor(60 * rarityMultipliers[rarity])
      };
    }
  }
};

const SKILL_NAMES = [
  'Apex Mastery',
  'Trail Braking Pro',
  'Weight Transfer',
  'Smooth Steering',
  'Late Apex',
  'Line Precision',
  'Corner Speed',
  'Drift Control',
  'Consistent Flow',
  'Aggressive Braking',
  'Line Smoothness',
  'Racing Line'
];

function generateSkillName(rng: SeededRandom): string {
  return rng.choice(SKILL_NAMES);
}

export class UpgradeGenerator {
  /**
   * Generate random upgrades based on difficulty and rarity pool
   */
  static generateUpgrades(
    count: number = 3,
    difficulty: number,
    seed: number
  ): Upgrade[] {
    const rng = new SeededRandom(seed);
    const upgrades: Upgrade[] = [];

    for (let i = 0; i < count; i++) {
      const templateKey = rng.choice(Object.keys(UPGRADE_TEMPLATES));
      const template = UPGRADE_TEMPLATES[templateKey];
      
      // Determine rarity based on weights
      const rarity = rng.weightedChoice(
        Object.entries(RARITY_WEIGHTS).map(([key, weight]) => ({
          item: key,
          weight: weight * (1 + difficulty / 5) // Higher difficulty increases rarity
        }))
      );

      const effect = template.effectGenerator(rng, rarity, difficulty);
      const cost = template.costCalculator(rarity, difficulty);

      upgrades.push({
        id: `upgrade_${templateKey}_${i}_${seed}`,
        name: template.name,
        description: template.description,
        type: templateKey === 'driverSkill' ? 'driver' : 'car',
        rarity: rarity as any,
        cost,
        effect,
        icon: templateKey
      });
    }

    return upgrades;
  }

  /**
   * Apply an upgrade to the player's configuration
   */
  static applyUpgrade(upgrade: Upgrade): Partial<any> {
    // This will be expanded when we integrate with game state
    return upgrade.effect;
  }
}
