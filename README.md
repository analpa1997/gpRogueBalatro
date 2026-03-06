# GP Rogue Balatro

A roguelike F1 racing game inspired by Balatro, built with React, TypeScript, HTML5, and CSS.

## Overview

GP Rogue Balatro is a deck-building/roguelike racing game where you progressively improve your Formula 1 car and driver through a series of randomly generated circuits. Each run is unique thanks to procedural generation systems that create varied challenges, boss battles, and upgrade opportunities.

### Key Features

- **Procedurally Generated Circuits**: Every circuit is unique, with parametrizable difficulty, weather conditions, and section variety
- **Car Component System**: Upgrade your engine, suspension, tires, aerodynamics, and brakes to improve performance
- **Driver Progression**: Develop driver skills and unlock special abilities
- **Roguelike Progression**: Progressive difficulty runs with escalating challenges and boss races
- **Resource Management**: Collect credits, blueprints, and reputation to unlock upgrades
- **Balatro-Inspired Mechanics**: Iterative build-out style gameplay applied to car upgrades

## Project Structure

```
src/
├── components/
│   ├── Game/          # Main game manager and UI scenes
│   ├── UI/            # General UI components
│   ├── Car/           # Car display and customization
│   ├── Driver/        # Driver display and skills
│   └── Circuit/       # Circuit visualization and info
├── systems/
│   ├── procedural-generation/  # Circuit generation algorithm
│   ├── upgrade-system/         # Upgrade mechanics
│   └── circuit-system/         # Circuit logic and race mechanics
├── types/             # TypeScript type definitions
├── constants/         # Game constants and balance
├── utils/             # Utility functions (procedural RNG, math)
└── styles/            # Global styles
```

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd gpRogueBalatro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How to Play

1. **Select Difficulty**: Choose from Rookie to Legendary difficulty
2. **View Garage**: Inspect your starting car and driver stats
3. **Race Circuits**: Attempt procedurally generated circuits
4. **Upgrade Components**: Choose from random upgrades after each race
5. **Face Bosses**: Defeat boss drivers to progress further
6. **Unlock Abilities**: Develop driver skills to enhance performance

## Game Mechanics

### Difficulty Levels

- **Rookie (1)**: Lower stats, easier bosses, more resources
- **Intermediate (2)**: Balanced challenge
- **Advanced (3)**: Harder opponents, less starting resources
- **Expert (4)**: Extreme difficulty, minimal resources
- **Legendary (5)**: Maximum challenge, hardest bosses

### Car Components

Each component affects different stats:
- **Engine**: Top Speed, Acceleration
- **Suspension**: Handling, Stability
- **Tires**: Grip (Acceleration, Handling, Braking)
- **Aerodynamics**: Top Speed, Stability
- **Brakes**: Braking Power

### Upgrades

Upgrades come in 5 rarity tiers:
- **Common**: Basic improvements
- **Uncommon**: Better stats
- **Rare**: Significant boosts
- **Epic**: Major improvements
- **Legendary**: Gamechanging effects

### Procedural Generation

The circuit generation system is highly parametrizable:
- **Difficulty**: Base difficulty multiplier
- **Variety Level**: Variation in section difficulties
- **Weather Chance**: Probability of weather effects
- **Boss Frequency**: How often bosses appear
- **Section Variety**: Different corner and straight types

## Development

### Adding New Features

1. **New Component Types**: Add to `src/components/`
2. **New Game Systems**: Add to `src/systems/`
3. **Type Definitions**: Update `src/types/index.ts`
4. **Constants/Balance**: Update `src/constants/index.ts`

### Customizing Generation

Edit `GENERATION_PARAMS_BY_DIFFICULTY` in `src/constants/index.ts` to adjust how different difficulty levels generate content.

### Testing Procedural Generation

```typescript
import { ProceduralCircuitGenerator } from './systems/procedural-generation/circuitGenerator';

const circuit = ProceduralCircuitGenerator.generateCircuit(
  {
    seed: 12345,
    difficulty: 3,
    minSections: 3,
    maxSections: 8,
    parameters: GENERATION_PARAMS_BY_DIFFICULTY[3]
  },
  0
);
```

## Technology Stack

- **React 18+**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **CSS3**: Styling with gradients and animations
- **Seeded RNG**: Deterministic procedural generation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

- [ ] Race simulation and lap time calculations
- [ ] Weather effects on performance
- [ ] Multi-lap races
- [ ] Pit stop strategy
- [ ] Driver personality and AI behavior
- [ ] Team management features
- [ ] Leaderboards and achievements
- [ ] Multiplayer support
- [ ] Custom circuit builder

## License

MIT License - Feel free to use, modify, and distribute

## Contributing

Contributions are welcome! Please submit pull requests with:
- Clear description of changes
- Test cases for new features
- Updated documentation

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Last Updated**: March 2026
**Version**: 0.1.0 - Initial Prototype
