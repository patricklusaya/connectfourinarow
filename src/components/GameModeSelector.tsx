import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { setGameMode } from '../store/slices/gameSlice';
import '../styles/GameModeSelector.css';

const GameModeSelector: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleSelectMode = (mode: 'friend' | 'robot') => {
    dispatch(setGameMode(mode));
  };

  return (
    <div className="mode-selector">
      <h2>Select Game Mode</h2>
      <div className="mode-buttons">
        <button
          className="mode-button mode-friend"
          onClick={() => handleSelectMode('friend')}
        >
          <div className="mode-icon mode-icon-friend"></div>
          <div className="mode-title">Play vs Friend</div>
          <div className="mode-description">Two players on the same device</div>
        </button>
        <button
          className="mode-button mode-robot"
          onClick={() => handleSelectMode('robot')}
        >
          <div className="mode-icon mode-icon-robot"></div>
          <div className="mode-title">Play vs Robot</div>
          <div className="mode-description">Challenge the AI opponent</div>
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;

