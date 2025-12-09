import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { makePlayerMove, makeAiMove, WinningCell } from '../store/slices/gameSlice';
import { playDropSound } from '../utils/sounds';
import '../styles/GameBoard.css';

const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { board, currentPlayer, winner, gameMode, winningCells } = useAppSelector(
    (state) => state.game
  );
  const [droppingPieces, setDroppingPieces] = useState<Map<string, number>>(new Map());
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Handle AI move after a delay when it's AI's turn
  useEffect(() => {
    if (gameMode === 'robot' && currentPlayer === 2 && !winner) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        playDropSound(); // Play sound for AI move
        dispatch(makeAiMove());
        setIsAiThinking(false);
      }, 800); // Delay for better UX
      return () => clearTimeout(timer);
    } else {
      setIsAiThinking(false);
    }
  }, [gameMode, currentPlayer, winner, dispatch]);

  const handleColumnClick = (col: number) => {
    if (winner) return;
    if (gameMode === 'robot' && currentPlayer === 2) return; // Wait for AI
    if (board[0][col] !== null) return; // Column is full

    // Play drop sound
    playDropSound();

    const key = `${col}-${Date.now()}`;
    setDroppingPieces(prev => new Map(prev).set(key, col));
    
    setTimeout(() => {
      setDroppingPieces(prev => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    }, 500);

    dispatch(makePlayerMove(col));
  };

  const getDropRow = (col: number): number => {
    for (let row = 0; row < 6; row++) {
      if (board[row][col] !== null) {
        return row - 1;
      }
    }
    return 5;
  };

  const renderCell = (row: number, col: number) => {
    const player = board[row][col];
    const isDropping = Array.from(droppingPieces.values()).includes(col);
    const dropRow = getDropRow(col);
    const isDropTarget = isDropping && row <= dropRow;
    const isWinningCell = winningCells.some((cell: WinningCell) => cell.row === row && cell.col === col);

    return (
      <div
        key={`${row}-${col}`}
        className={`cell ${player === 1 ? 'player1' : player === 2 ? 'player2' : ''} ${
          isDropTarget ? 'dropping' : ''
        } ${isWinningCell ? 'winning' : ''}`}
      >
        {player && (
          <div className={`piece player${player}`}>
            <div className="piece-shine"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="game-board-container">
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      <div className="column-buttons">
        {Array(7)
          .fill(null)
          .map((_, col) => {
            const isColumnFull = board[0][col] !== null;
            const canPlay = !winner && 
              (gameMode === 'friend' || (gameMode === 'robot' && currentPlayer === 1)) &&
              !isColumnFull &&
              !isAiThinking;

            return (
              <button
                key={col}
                className={`column-button ${canPlay ? 'clickable' : ''} ${
                  currentPlayer === 1 ? 'player1-indicator' : 'player2-indicator'
                }`}
                onClick={() => handleColumnClick(col)}
                disabled={!canPlay}
                aria-label={`Drop piece in column ${col + 1}`}
              >
                <span className="drop-arrow">▼</span>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default GameBoard;
