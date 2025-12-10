import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Player = 1 | 2 | null;
export type Board = Player[][];
export type GameMode = 'friend' | 'robot' | null;
export type WinningCell = { row: number; col: number };

interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameMode: GameMode;
  loading: boolean;
  winningCells: WinningCell[];
  lastPlacedCell: WinningCell | null;
}

const ROWS = 6;
const COLS = 7;

const initialState: GameState = {
  board: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)) as Board,
  currentPlayer: 1,
  winner: null,
  winningCells: [],
  gameMode: null,
  loading: false,
  lastPlacedCell: null,
};

// Initialize empty board
const createEmptyBoard = (): Board => {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(null)) as Board;
};

// Check for win condition and return winning cells
const checkWinner = (board: Board, row: number, col: number, player: Player): { won: boolean; cells: Array<{row: number; col: number}> } => {
  if (!player) return { won: false, cells: [] };

  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal \
    [1, -1],  // diagonal /
  ];

  for (const [dx, dy] of directions) {
    let cells: Array<{row: number; col: number}> = [{row, col}];

    // Check positive direction
    for (let i = 1; i < 4; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (
        newRow >= 0 && newRow < ROWS &&
        newCol >= 0 && newCol < COLS &&
        board[newRow][newCol] === player
      ) {
        cells.push({row: newRow, col: newCol});
      } else {
        break;
      }
    }

    // Check negative direction
    for (let i = 1; i < 4; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (
        newRow >= 0 && newRow < ROWS &&
        newCol >= 0 && newCol < COLS &&
        board[newRow][newCol] === player
      ) {
        cells.unshift({row: newRow, col: newCol});
      } else {
        break;
      }
    }

    if (cells.length >= 4) {
      return { won: true, cells: cells.slice(0, 4) };
    }
  }

  return { won: false, cells: [] };
};

// Check for draw
const checkDraw = (board: Board): boolean => {
  return board[0].every(cell => cell !== null);
};

// Make a move
const makeMove = (board: Board, col: number, player: Player): { newBoard: Board; row: number } | null => {
  const newBoard = board.map(row => [...row]);
  
  // Find the lowest empty cell in the column
  for (let row = ROWS - 1; row >= 0; row--) {
    if (newBoard[row][col] === null) {
      newBoard[row][col] = player;
      return { newBoard, row };
    }
  }
  
  return null; // Column is full
};

// AI Logic - Minimax with alpha-beta pruning
const evaluateBoard = (board: Board, player: Player): number => {
  const opponent: Player = player === 1 ? 2 : 1;
  let score = 0;

  // Evaluate all possible lines (horizontal, vertical, diagonal)
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1]
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      for (const [dx, dy] of directions) {
        const line = [];
        for (let i = 0; i < 4; i++) {
          const newRow = row + dx * i;
          const newCol = col + dy * i;
          if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
            line.push(board[newRow][newCol]);
          }
        }
        
        if (line.length === 4) {
          const playerCount = line.filter(cell => cell === player).length;
          const opponentCount = line.filter(cell => cell === opponent).length;
          const emptyCount = line.filter(cell => cell === null).length;

          if (playerCount === 4) score += 10000;
          else if (playerCount === 3 && emptyCount === 1) score += 100;
          else if (playerCount === 2 && emptyCount === 2) score += 10;
          else if (opponentCount === 4) score -= 10000;
          else if (opponentCount === 3 && emptyCount === 1) score -= 100;
          else if (opponentCount === 2 && emptyCount === 2) score -= 10;
        }
      }
    }
  }

  return score;
};

const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  player: Player
): number => {
  // Check for terminal states
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col]) {
        const winResult = checkWinner(board, row, col, board[row][col]);
        if (winResult.won) {
          return board[row][col] === player ? 10000 : -10000;
        }
      }
    }
  }

  if (checkDraw(board) || depth === 0) {
    return evaluateBoard(board, player);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let col = 0; col < COLS; col++) {
      const moveResult = makeMove(board, col, player);
      if (moveResult) {
        const evaluation = minimax(moveResult.newBoard, depth - 1, alpha, beta, false, player);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return maxEval;
  } else {
    const opponent: Player = player === 1 ? 2 : 1;
    let minEval = Infinity;
    for (let col = 0; col < COLS; col++) {
      const moveResult = makeMove(board, col, opponent);
      if (moveResult) {
        const evaluation = minimax(moveResult.newBoard, depth - 1, alpha, beta, true, player);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return minEval;
  }
};

const getBestMove = (board: Board, player: Player): number => {
  let bestMove = -1;
  let bestValue = -Infinity;
  const depth = 5; // Adjust depth for difficulty (higher = smarter but slower)

  for (let col = 0; col < COLS; col++) {
    const moveResult = makeMove(board, col, player);
    if (moveResult) {
      const moveValue = minimax(moveResult.newBoard, depth - 1, -Infinity, Infinity, false, player);
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = col;
      }
    }
  }

  // If no good move found, pick a random valid column
  if (bestMove === -1) {
    const validMoves = [];
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) {
        validMoves.push(col);
      }
    }
    if (validMoves.length > 0) {
      bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  }

  return bestMove;
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    makeMove: (state, action: PayloadAction<number>) => {
      if (state.winner || state.loading || !state.gameMode) return;
      if (state.gameMode === 'robot' && state.currentPlayer === 2) return; // Don't allow player to move for AI
      
      const col = action.payload;
      const moveResult = makeMove(state.board, col, state.currentPlayer);
      
      if (moveResult) {
        const { newBoard, row } = moveResult;
        const winResult = checkWinner(newBoard, row, col, state.currentPlayer);
        const winner = winResult.won
          ? state.currentPlayer
          : checkDraw(newBoard)
            ? 'draw'
            : null;
        
        state.board = newBoard;
        state.winner = winner;
        state.winningCells = winResult.won ? winResult.cells : [];
        state.lastPlacedCell = { row, col };
        
        if (!winner) {
          state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        }
      }
    },
    makeAiMove: (state) => {
      if (state.winner || state.currentPlayer !== 2 || state.gameMode !== 'robot') return;
      
      const bestCol = getBestMove(state.board, 2);
      if (bestCol !== -1) {
        const moveResult = makeMove(state.board, bestCol, 2);
        if (moveResult) {
          const { newBoard, row } = moveResult;
          const winResult = checkWinner(newBoard, row, bestCol, 2);
          const winner = winResult.won
            ? 2
            : checkDraw(newBoard)
              ? 'draw'
              : null;
          
          state.board = newBoard;
          state.winner = winner;
          state.winningCells = winResult.won ? winResult.cells : [];
          state.lastPlacedCell = { row, col: bestCol };
          
          if (!winner) {
            state.currentPlayer = 1;
          }
        }
      }
    },
    resetGame: (state) => {
      state.board = createEmptyBoard();
      state.currentPlayer = 1;
      state.winner = null;
      state.winningCells = [];
      state.lastPlacedCell = null;
    },
    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.gameMode = action.payload;
      state.board = createEmptyBoard();
      state.currentPlayer = 1;
      state.winner = null;
      state.winningCells = [];
      state.lastPlacedCell = null;
    },
  },
});

export const {
  makeMove: makePlayerMove,
  makeAiMove,
  resetGame,
  setGameMode,
} = gameSlice.actions;

export default gameSlice.reducer;
