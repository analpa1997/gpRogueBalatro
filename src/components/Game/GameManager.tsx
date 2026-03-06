import React, { useState } from 'react';
import type { GameState, Driver, Car, Resources, Circuit } from '../../types';
import { GameScene } from '../../types';
import { STARTING_RESOURCES, BASE_CAR_COMPONENTS, DIFFICULTY_LEVELS, GAME_PROGRESSION, GENERATION_PARAMS_BY_DIFFICULTY } from '../../constants';
import { ProceduralCircuitGenerator } from '../../systems/procedural-generation/circuitGenerator';
import { RaceSimulation } from '../../systems/circuit-system/raceSimulation';
import { CircuitManager } from '../../systems/circuit-system/circuitManager';
import './Game.css';

interface GameManagerProps {
  onStateChange?: (state: GameState) => void;
}

export const GameManager: React.FC<GameManagerProps> = ({ onStateChange }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScene, setCurrentScene] = useState<GameScene>(GameScene.MENU);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);
  const [circuitManager] = useState(() => new CircuitManager());

  // Initialize new game
  const startNewGame = (difficulty: number) => {
    const resources: Resources = STARTING_RESOURCES[difficulty] as Resources;
    const circuitsSeed = Math.floor(Math.random() * 1000000);

    const playerCar: Car = {
      components: {
        engine: BASE_CAR_COMPONENTS.engine,
        suspension: BASE_CAR_COMPONENTS.suspension,
        tires: BASE_CAR_COMPONENTS.tires,
        aerodynamics: BASE_CAR_COMPONENTS.aerodynamics,
        brakes: BASE_CAR_COMPONENTS.brakes
      },
      totalStats: {
        topSpeed: 300,
        acceleration: 80,
        handling: 75,
        braking: 75,
        stability: 65,
        durability: 8
      }
    };

    const playerDriver: Driver = {
      name: 'You',
      level: 1,
      experience: 0,
      skills: [],
      stats: {
        cornering: 70,
        braking: 70,
        acceleration: 70,
        consistency: 70,
        riskTaking: 50
      }
    };

    // Generate circuits for this run
    const generatedCircuits = ProceduralCircuitGenerator.generateRunCircuits(
      {
        seed: circuitsSeed,
        difficulty,
        minSections: GAME_PROGRESSION.CIRCUITS_PER_SEASON,
        maxSections: GAME_PROGRESSION.CIRCUITS_PER_SEASON,
        parameters: GENERATION_PARAMS_BY_DIFFICULTY[difficulty] || GENERATION_PARAMS_BY_DIFFICULTY[5]
      },
      GAME_PROGRESSION.CIRCUITS_PER_SEASON
    );

    // Calculate lap times for each circuit
    const circuitsWithTimes = generatedCircuits.map(circuit => {
      const playerLapTime = RaceSimulation.calculateLapTime(
        circuit,
        playerCar.totalStats,
        playerDriver.stats
      );
      
      // Store calculated times for reference
      (circuit as any).playerBestLapTime = playerLapTime;
      
      if (circuit.boss) {
        const bossLapTime = RaceSimulation.calculateBossLapTime(circuit);
        (circuit as any).bossLapTime = bossLapTime;
      }
      
      return circuit;
    });

    // Set up circuit manager
    circuitManager.setCircuits(circuitsWithTimes);

    const firstCircuit = circuitsWithTimes[0];

    const newState: GameState = {
      currentCircuit: firstCircuit,
      playerCar,
      playerDriver,
      resources,
      completedCircuits: [],
      currentRun: {
        difficulty,
        circuitsSeed,
        upgrdesObtained: [],
        currentCircuitIndex: 0
      }
    };

    setGameState(newState);
    setCurrentScene(GameScene.GARAGE);
    onStateChange?.(newState);
  };

  const switchScene = (scene: GameScene) => {
    setCurrentScene(scene);
  };

  return (
    <div className="game-manager">
      {currentScene === GameScene.MENU && !gameState && (
        <MainMenu
          onStartGame={startNewGame}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
        />
      )}
      
      {gameState && currentScene === GameScene.GARAGE && (
        <GarageScene
          gameState={gameState}
          onSceneChange={switchScene}
        />
      )}

      {gameState && currentScene === GameScene.MAP && (
        <MapScene
          onSceneChange={switchScene}
          circuitManager={circuitManager}
          gameState={gameState}
        />
      )}
    </div>
  );
};

interface MainMenuProps {
  onStartGame: (difficulty: number) => void;
  selectedDifficulty: number;
  onDifficultyChange: (difficulty: number) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  selectedDifficulty,
  onDifficultyChange
}) => {
  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1>GP Rogue Balatro</h1>
        <p className="subtitle">A roguelike F1 racing game</p>

        <div className="difficulty-selector">
          <h2>Select Difficulty</h2>
          <div className="difficulty-buttons">
            {Object.entries(DIFFICULTY_LEVELS).map(([name, level]) => (
              <button
                key={level}
                className={`difficulty-btn ${
                  selectedDifficulty === level ? 'active' : ''
                }`}
                onClick={() => onDifficultyChange(level)}
              >
                <span className="difficulty-name">{name}</span>
                <span className="difficulty-level">Level {level}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="start-button" onClick={() => onStartGame(selectedDifficulty)}>
          Start New Run
        </button>

        <div className="menu-footer">
          <p>Customize your car and driver, then challenge circuits across the globe.</p>
          <p>A roguelike experience: every run is unique!</p>
        </div>
      </div>
    </div>
  );
};

interface GarageSceneProps {
  gameState: GameState;
  onSceneChange: (scene: GameScene) => void;
}

const GarageScene: React.FC<GarageSceneProps> = ({
  gameState,
  onSceneChange
}) => {
  return (
    <div className="garage-scene">
      <div className="garage-header">
        <h1>Garage</h1>
        <div className="resources-display">
          <div className="resource">
            <span className="label">Credits</span>
            <span className="value">{gameState.resources.credits}</span>
          </div>
          <div className="resource">
            <span className="label">Blueprints</span>
            <span className="value">{gameState.resources.blueprints}</span>
          </div>
          <div className="resource">
            <span className="label">Reputation</span>
            <span className="value">{gameState.resources.reputation}</span>
          </div>
        </div>
      </div>

      <div className="garage-content">
        <div className="car-section">
          <h2>Your Car</h2>
          <CarDisplay car={gameState.playerCar} />
        </div>

        <div className="driver-section">
          <h2>Your Driver</h2>
          <DriverDisplay driver={gameState.playerDriver} />
        </div>
      </div>

      <div className="garage-actions">
        <button
          className="action-button ready"
          onClick={() => onSceneChange(GameScene.MAP)}
        >
          Ready to Race
        </button>
      </div>
    </div>
  );
};

interface CarDisplayProps {
  car: Car;
}

const CarDisplay: React.FC<CarDisplayProps> = ({ car }) => {
  return (
    <div className="car-display">
      <div className="component-grid">
        {Object.entries(car.components).map(([key, component]) => (
          <div key={key} className="component-card">
            <div className="component-name">{component.name}</div>
            <div className="component-tier">Tier {component.tier}</div>
            <div className="component-stats">
              <div>Top Speed: {component.stats.topSpeed}</div>
              <div>Acceleration: {component.stats.acceleration}</div>
              <div>Handling: {component.stats.handling}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="car-stats">
        <h3>Total Stats</h3>
        <div className="stat">
          <span>Top Speed:</span>
          <span className="value">{car.totalStats.topSpeed}</span>
        </div>
        <div className="stat">
          <span>Acceleration:</span>
          <span className="value">{car.totalStats.acceleration}</span>
        </div>
        <div className="stat">
          <span>Handling:</span>
          <span className="value">{car.totalStats.handling}</span>
        </div>
      </div>
    </div>
  );
};

interface DriverDisplayProps {
  driver: Driver;
}

const DriverDisplay: React.FC<DriverDisplayProps> = ({ driver }) => {
  return (
    <div className="driver-display">
      <div className="driver-info">
        <h3>{driver.name}</h3>
        <div className="driver-level">Level {driver.level}</div>
      </div>
      <div className="driver-stats">
        <div className="stat">
          <span>Cornering:</span>
          <span className="value">{driver.stats.cornering}</span>
        </div>
        <div className="stat">
          <span>Braking:</span>
          <span className="value">{driver.stats.braking}</span>
        </div>
        <div className="stat">
          <span>Acceleration:</span>
          <span className="value">{driver.stats.acceleration}</span>
        </div>
        <div className="stat">
          <span>Consistency:</span>
          <span className="value">{driver.stats.consistency}</span>
        </div>
        <div className="stat">
          <span>Risk Taking:</span>
          <span className="value">{driver.stats.riskTaking}</span>
        </div>
      </div>
      {driver.skills.length > 0 && (
        <div className="driver-skills">
          <h4>Skills</h4>
          {driver.skills.map(skill => (
            <div key={skill.id} className="skill">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">Lvl {skill.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface MapSceneProps {
  onSceneChange: (scene: GameScene) => void;
  circuitManager: CircuitManager;
  gameState: GameState;
}

const MapScene: React.FC<MapSceneProps> = ({ onSceneChange, circuitManager, gameState }) => {
  const circuits = circuitManager.getAllCircuits();
  const progress = circuitManager.getProgress();

  return (
    <div className="map-scene">
      <div className="map-header">
        <h1>Circuit Map</h1>
        <div className="progress-info">
          <span>Season Progress: {progress.current} / {progress.total}</span>
        </div>
      </div>

      <div className="circuits-grid">
        {circuits.map((circuit, index) => (
          <CircuitCard
            key={circuit.id}
            circuit={circuit}
            index={index}
            isCurrent={index === gameState.currentRun.currentCircuitIndex}
            isCompleted={gameState.completedCircuits.some(r => r.circuitId === circuit.id)}
            circuitManager={circuitManager}
          />
        ))}
      </div>

      <div className="map-actions">
        <button
          className="action-button"
          onClick={() => onSceneChange(GameScene.GARAGE)}
        >
          Back to Garage
        </button>
      </div>
    </div>
  );
};

interface CircuitCardProps {
  circuit: Circuit;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  circuitManager: CircuitManager;
}

const CircuitCard: React.FC<CircuitCardProps> = ({
  circuit,
  index,
  isCurrent,
  isCompleted,
  circuitManager
}) => {
  const difficulty = circuitManager.getCircuitDifficulty(circuit);
  const difficultyPercentage = Math.round(difficulty * 100);
  const playerLapTime = (circuit as any).playerBestLapTime || circuit.baseTargetLapTime;
  const bossLapTime = (circuit as any).bossLapTime;

  const getDifficultyColor = (diff: number) => {
    if (diff < 0.3) return '#00ff00';
    if (diff < 0.5) return '#ffff00';
    if (diff < 0.7) return '#ff8800';
    return '#ff0000';
  };

  return (
    <div
      className={`circuit-card ${isCurrent ? 'current' : ''} ${
        isCompleted ? 'completed' : ''
      }`}
    >
      <div className="circuit-number">Circuit {index + 1}</div>
      <div className="circuit-title">{circuit.name}</div>

      <div className="circuit-info">
        <div className="info-row">
          <span className="label">Length:</span>
          <span className="value">{(circuit.length / 1000).toFixed(2)} km</span>
        </div>

        <div className="info-row">
          <span className="label">Sections:</span>
          <span className="value">{circuit.sections.length}</span>
        </div>

        <div className="info-row">
          <span className="label">Difficulty:</span>
          <div className="difficulty-bar">
            <div
              className="difficulty-fill"
              style={{
                width: `${difficultyPercentage}%`,
                backgroundColor: getDifficultyColor(difficulty)
              }}
            />
          </div>
          <span className="value">{difficultyPercentage}%</span>
        </div>

        <div className="info-row">
          <span className="label">Your Lap Time:</span>
          <span className="value">{playerLapTime.toFixed(1)}s</span>
        </div>

        <div className="info-row">
          <span className="label">Target Lap Time:</span>
          <span className="value">{circuit.baseTargetLapTime.toFixed(1)}s</span>
        </div>

        {circuit.boss && (
          <>
            <div className="divider" />
            <div className="boss-info">
              <div className="boss-title">Boss: {circuit.boss.name}</div>
              <div className="boss-stats">
                <div className="stat">
                  <span>Aggressiveness:</span>
                  <span className="value">
                    {(circuit.boss.drivingStyle.aggressiveness * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="stat">
                  <span>Risk Taking:</span>
                  <span className="value">
                    {(circuit.boss.drivingStyle.riskTaking * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              {bossLapTime && (
                <div className="boss-time">
                  Boss Lap Time: <span className="value">{bossLapTime.toFixed(1)}s</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isCompleted && <div className="completed-badge">✓ Completed</div>}
      {isCurrent && <div className="current-badge">← Current</div>}
    </div>
  );
};
