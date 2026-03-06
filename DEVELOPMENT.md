# GP Rogue Balatro - Development Guide

## Quick Start

```bash
cd j:\repositories\gpRogueBalatro
npm install
npm run dev
```

The development server will run on `http://localhost:5173/`

---

## Architecture Overview

### Type System (`src/types/index.ts`)
- **GameState**: Global game state management
- **Car/Driver**: Vehicle and player data structures
- **Circuit/Race**: Procedurally generated content
- **Upgrade**: Progression and customization systems

### Constants (`src/constants/index.ts`)
All game balance values are here:
- Component stats
- Difficulty scaling
- Boss configurations
- Generation parameters

### Systems

#### Procedural Generation (`src/systems/procedural-generation/`)
- **SeededRandom**: Deterministic RNG for reproducible circuits
- **ProceduralCircuitGenerator**: Creates unique, parametrizable circuits
- Circuit sections, weather, and difficulty variations

#### Upgrade System (`src/systems/upgrade-system/`)
- **UpgradeGenerator**: Generates random upgrades by rarity
- Supports car components and driver skills
- Configurable costs and effects

#### Circuit System (`src/systems/circuit-system/`)
*Not yet implemented - next phase*
- Race simulation
- Lap time calculations
- Weather effects
- Boss AI behavior

### Components

#### Game Manager (`src/components/Game/GameManager.tsx`)
Main state management and scene transitions:
- MainMenu: Difficulty selection
- GarageScene: Car/driver customization
- MapScene: Circuit selection *(to be expanded)*

---

## Next Development Steps

### Phase 2: Race System
1. **Race Simulation**
   - Implement lap time calculations based on car stats and difficulty
   - Factor in driver skills and consistency
   - Weather effects on performance

2. **Circuit Rendering**
   - Visualize circuit layout
   - Show sections with difficulty indicators
   - Display boss information

### Phase 3: Upgrade Selection & Application
1. **Upgrade Selection UI**
   - Show 3 random upgrades after each race
   - Display rarity colors and effects
   - Apply selected upgrades to car/driver

2. **Stat Calculations**
   - Implement car stat aggregation
   - Driver skill bonus application
   - Performance scaling

### Phase 4: Polish & Mechanics
1. **Game Loop Completion**
   - Multiple circuits per run
   - Progressive difficulty
   - Game over conditions
   - Victory conditions

2. **Visual Polish**
   - Animations for upgrades
   - Circuit map visuals
   - Race replay/summary

3. **Balance**
   - Adjust generation parameters
   - Tune boss difficulty
   - Resource economy

---

## Key Systems to Implement

### Lap Time Calculation
```typescript
// Pseudo-code for reference
const lapTime = baseCircuitTime * difficultyMultiplier
  * (1 - carQuality * 0.1)
  * (1 - driverSkill * 0.05)
  * weatherModifier;
```

### Weather Effects
Currently defined in constants but not applied. Implement in race simulation:
- Dry: 100% traction
- Wet: 70% traction, 80% downforce
- Rainy: 50% traction, 60% downforce
- Fog: 80% traction, 90% downforce

### Boss Difficulty Scaling
Bosses get progressively harder based on difficulty level. Their stats are multiplied by 0.85-1.15 for variation.

---

## File Organization Conventions

### Component Files
```
src/components/[Category]/[Component].tsx
src/components/[Category]/[Component].css  // Co-located styles
```

### System Files
```
src/systems/[SystemName]/[Function].ts
src/systems/[SystemName]/index.ts  // Re-exports
```

### Utilities
```
src/utils/[utility-category].ts
src/utils/procedural.ts  // RNG and math utilities
```

---

## Testing Procedural Generation

Generate a circuit set for testing:

```typescript
import { ProceduralCircuitGenerator } from './systems/procedural-generation/circuitGenerator';
import { GENERATION_PARAMS_BY_DIFFICULTY } from './constants';

// Generate 5 circuits for difficulty 3
const circuits = ProceduralCircuitGenerator.generateRunCircuits(
  {
    seed: Math.floor(Math.random() * 1000000),
    difficulty: 3,
    minSections: 3,
    maxSections: 8,
    parameters: GENERATION_PARAMS_BY_DIFFICULTY[3]
  },
  5
);

console.log(circuits);
```

---

## Performance Considerations

1. **Memoization**: Use React.memo for expensive component renders
2. **Procedural Generation**: All generation is instant due to seeded RNG
3. **State Management**: Currently using React useState - consider Redux if it grows
4. **Asset Loading**: No heavy assets yet, plan for sprites/images

---

## Common Customizations

### Change Generation Difficulty
Edit `GENERATION_PARAMS_BY_DIFFICULTY` in `constants/index.ts`

### Adjust Car Components
Modify `BASE_CAR_COMPONENTS` stats in `constants/index.ts`

### Tweak Upgrade Costs
Update the `costCalculator` in `upgradeGenerator.ts`

### Modify Boss Stats
Adjust `BOSS_CONFIGS` in `constants/index.ts`

---

## GitHub Repository

**Repository**: [https://github.com/analpa1997/gpRogueBalatro](https://github.com/analpa1997/gpRogueBalatro)

Push changes regularly:
```bash
git add .
git commit -m "Description of changes"
git push origin master
```

---

## Technologies & Dependencies

- **React**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool & dev server
- **CSS3**: Styling (no Bootstrap/Tailwind yet)

To add dependencies:
```bash
npm install [package-name]
```

---

## Known Limitations (v0.1.0)

- [ ] No actual race simulation yet
- [ ] Upgrade selection is placeholder
- [ ] Circuit map is empty
- [ ] No weather visual effects
- [ ] No sound effects or music
- [ ] Single-player only
- [ ] No save/load system

---

## Questions or Issues?

Refer to the main README or open an issue on GitHub.

Good luck, and happy coding! 🏁
