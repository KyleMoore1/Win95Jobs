import React, { useState, useEffect } from 'react';
import { X, Minus, Square, Smile, Frown } from 'lucide-react';

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type GameState = 'playing' | 'won' | 'lost';

const BOARD_SIZE = 9;
const MINES_COUNT = 10;

type MinesweeperProps = {
  onClose: () => void;
};

const Minesweeper = ({ onClose }: MinesweeperProps) => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [minesLeft, setMinesLeft] = useState(MINES_COUNT);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Initialize board
  const initializeBoard = () => {
    // Create empty board
    const newBoard = Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 &&
                newRow < BOARD_SIZE &&
                newCol >= 0 &&
                newCol < BOARD_SIZE &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    return newBoard;
  };

  // Reset game
  const resetGame = () => {
    setBoard(initializeBoard());
    setGameState('playing');
    setMinesLeft(MINES_COUNT);
    setTime(0);
    setTimerActive(false);
  };

  // Handle cell reveal
  const revealCell = (row: number, col: number) => {
    if (gameState !== 'playing' || board[row][col].isFlagged) return;

    if (!timerActive) {
      setTimerActive(true);
    }

    const newBoard = [...board];
    
    if (newBoard[row][col].isMine) {
      // Game over
      newBoard[row][col].isRevealed = true;
      setBoard(newBoard);
      setGameState('lost');
      setTimerActive(false);
      return;
    }

    // Flood fill for empty cells
    const floodFill = (r: number, c: number) => {
      if (
        r < 0 ||
        r >= BOARD_SIZE ||
        c < 0 ||
        c >= BOARD_SIZE ||
        newBoard[r][c].isRevealed ||
        newBoard[r][c].isFlagged
      ) {
        return;
      }

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            floodFill(r + i, c + j);
          }
        }
      }
    };

    floodFill(row, col);
    setBoard(newBoard);

    // Check for win
    const hasWon = board.every(row =>
      row.every(cell => cell.isMine ? !cell.isRevealed : cell.isRevealed)
    );
    
    if (hasWon) {
      setGameState('won');
      setTimerActive(false);
    }
  };

  // Handle right click (flag)
  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setMinesLeft(minesLeft + (newBoard[row][col].isFlagged ? -1 : 1));
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Initialize board on mount
  useEffect(() => {
    resetGame();
  }, []);

  const getCellContent = (cell: Cell) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : '';
    }
    if (cell.isMine) {
      return '💣';
    }
    return cell.neighborMines || '';
  };

  const getCellColor = (cell: Cell) => {
    if (!cell.isRevealed) return '';
    if (cell.neighborMines === 1) return 'text-blue-600';
    if (cell.neighborMines === 2) return 'text-green-600';
    if (cell.neighborMines === 3) return 'text-red-600';
    if (cell.neighborMines === 4) return 'text-blue-800';
    if (cell.neighborMines === 5) return 'text-red-800';
    if (cell.neighborMines === 6) return 'text-cyan-600';
    if (cell.neighborMines === 7) return 'text-black';
    if (cell.neighborMines === 8) return 'text-gray-600';
    return '';
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[400px] win95-window z-50">
      {/* Title Bar */}
      <div className="bg-[#000080] text-white p-1 flex items-center justify-between">
        <span className="truncate">Minesweeper</span>
        <div className="flex gap-1">
          <div className="win95-button-static p-1">
            <Minus className="w-3 h-3" />
          </div>
          <div className="win95-button-static p-1">
            <Square className="w-3 h-3" />
          </div>
          <button 
            className="win95-button p-1"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Game Container */}
      <div className="p-4 bg-[#C0C0C0]">
        {/* Status Bar */}
        <div className="flex justify-between mb-4">
          <div className="win95-inset px-2 py-1 w-16 text-red-600 font-bold">
            {minesLeft.toString().padStart(3, '0')}
          </div>
          <button
            className="win95-button p-1"
            onClick={resetGame}
          >
            {gameState === 'lost' ? (
              <Frown className="w-6 h-6" />
            ) : (
              <Smile className="w-6 h-6" />
            )}
          </button>
          <div className="win95-inset px-2 py-1 w-16 text-red-600 font-bold">
            {time.toString().padStart(3, '0')}
          </div>
        </div>

        {/* Game Board */}
        <div className="win95-inset p-2">
          <div className="grid grid-cols-9 gap-[1px]">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-8 h-8 flex items-center justify-center text-sm font-bold
                    ${cell.isRevealed
                      ? 'win95-inset bg-[#C0C0C0]'
                      : 'win95-button active:win95-inset'
                    }
                    ${getCellColor(cell)}
                  `}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                  disabled={gameState !== 'playing'}
                >
                  {getCellContent(cell)}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;