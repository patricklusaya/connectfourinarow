import React from 'react';
import { useAppSelector } from '../store/hooks';
import GameModeSelector from './GameModeSelector';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import BuyMeACoffee from './BuyMeACoffee';
import '../styles/Game.css';

const Game: React.FC = () => {
  const { gameMode } = useAppSelector((state) => state.game);

  return (
    <div className="game-container">
      {/* <ThemeToggle /> */}
      {!gameMode ? (
        <>
          <div className="game-header">
            <h1>Connect Four</h1>
            <p className="game-subtitle">Connect 4 pieces in a row to win!</p>
          </div>
          <GameModeSelector />
        </>
      ) : (
        <>
          <div className="game-header">
            <h1>Connect Four</h1>
          </div>
          <GameControls />
          <GameBoard />
        </>
      )}
      <BuyMeACoffee />
    </div>
  );
};

export default Game;

