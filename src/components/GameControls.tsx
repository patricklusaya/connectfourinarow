import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetGame, setGameMode } from '../store/slices/gameSlice';
import { playWinSound, playDrawSound } from '../utils/sounds';
import WinnerAnnouncement from './WinnerAnnouncement';
import '../styles/GameControls.css';

const GameControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { winner, currentPlayer, gameMode } = useAppSelector(
    (state) => state.game
  );
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);

  useEffect(() => {
    if (gameMode === 'robot' && currentPlayer === 2 && !winner) {
      setIsAiThinking(true);
    } else {
      setIsAiThinking(false);
    }
  }, [gameMode, currentPlayer, winner]);

  // Confetti and sound effects on win
  useEffect(() => {
    if (winner && winner !== 'draw') {
      playWinSound();
      setShowWinnerAnnouncement(true);
      
      // Launch confetti with winner announcement
      const duration = 4000;
      const end = Date.now() + duration;

      // Initial burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: winner === 1 ? ['#ff6b6b', '#ee5a5a', '#dc4646'] : ['#4dabf7', '#339af0', '#1c7ed6'],
      });

      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }

        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
          colors: winner === 1 ? ['#ff6b6b', '#ee5a5a', '#dc4646'] : ['#4dabf7', '#339af0', '#1c7ed6'],
        });
      }, 250);

      // Cleanup
      return () => clearInterval(interval);
    } else if (winner === 'draw') {
      playDrawSound();
    }
  }, [winner]);

  const handleReset = () => {
    dispatch(resetGame());
  };

  const handleBackToMenu = () => {
    dispatch(setGameMode(null));
    dispatch(resetGame());
  };

  const getStatusMessage = () => {
    if (isAiThinking) {
      return '🤖 Robot is thinking...';
    }
    
    if (winner === 'draw') {
      return "It's a Draw!";
    }
    
    if (winner === 1) {
      return gameMode === 'robot' 
        ? '🎉 You Win!' 
        : '🏆 Player 1 Wins!';
    }
    
    if (winner === 2) {
      return gameMode === 'robot' 
        ? '😢 Robot Wins!' 
        : '🏆 Player 2 Wins!';
    }
    
    return gameMode === 'robot' 
      ? `Your Turn (${currentPlayer === 1 ? 'You' : 'Robot'})` 
      : `Player ${currentPlayer}'s Turn`;
  };

  return (
    <>
      {showWinnerAnnouncement && winner !== 'draw' && winner && (
        <WinnerAnnouncement
          winner={winner}
          gameMode={gameMode || 'friend'}
          onClose={() => setShowWinnerAnnouncement(false)}
        />
      )}
      <div className="game-controls">
        <div className="game-status">
          <div className={`status-message ${winner ? 'winner' : ''} ${isAiThinking ? 'thinking' : ''}`}>
            {getStatusMessage()}
          </div>
        </div>

        <div className="control-buttons">
          <button onClick={handleReset} className="btn btn-reset">
            🔄 Reset Game
          </button>
          <button onClick={handleBackToMenu} className="btn btn-menu">
            ← Back to Menu
          </button>
        </div>
      </div>
    </>
  );
};

export default GameControls;
