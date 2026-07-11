import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createStage, checkCollision } from '../lib/helpers';
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import Stage from './Stage';
import Display from './Display';
import { Controls } from '../types';
import { Play, Pause, RotateCcw, Home } from 'lucide-react';

interface TetrisProps {
  controls: Controls;
  onGameOver: (score: number, level: number) => void;
  onExit: () => void;
  isVsMode?: boolean;
  resetTrigger?: number;
}

const Tetris: React.FC<TetrisProps> = ({ controls, onGameOver, onExit, isVsMode, resetTrigger }) => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = useCallback(() => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    setIsPaused(false);
    gameAreaRef.current?.focus();
  }, [resetPlayer, setLevel, setRows, setScore, setStage]);

  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      startGame();
    }
  }, [resetTrigger, startGame]);

  const drop = () => {
    // Increase speed every level
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        if (score > 0) {
          onGameOver(score, level);
        } else if (isVsMode) {
          onGameOver(0, level); // Notify VsGame even if 0
        }
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = useCallback((e: KeyboardEvent) => {
    if (!gameOver && !isPaused) {
      if (e.key === controls.down) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  }, [gameOver, isPaused, controls.down, level]);

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const hardDrop = () => {
    let tmpY = 0;
    while (!checkCollision(player, stage, { x: 0, y: tmpY + 1 })) {
      tmpY += 1;
    }
    updatePlayerPos({ x: 0, y: tmpY, collided: true });
  };

  const togglePause = () => {
    if (gameOver) return;
    if (isPaused) {
      setIsPaused(false);
      setDropTime(1000 / (level + 1) + 200);
      gameAreaRef.current?.focus();
    } else {
      setIsPaused(true);
      setDropTime(null);
    }
  };

  const move = useCallback(
    (e: KeyboardEvent) => {
      if (!gameOver) {
        if (e.key === controls.pause) {
          togglePause();
          return;
        }

        if (!isPaused) {
          if (e.key === controls.left) {
            e.preventDefault();
            movePlayer(-1);
          } else if (e.key === controls.right) {
            e.preventDefault();
            movePlayer(1);
          } else if (e.key === controls.down) {
            e.preventDefault();
            dropPlayer();
          } else if (e.key === controls.rotate) {
            e.preventDefault();
            playerRotate(stage, 1);
          } else if (e.key === controls.hardDrop) {
            e.preventDefault();
            hardDrop();
          }
        }
      }
    },
    [controls, gameOver, isPaused, movePlayer, dropPlayer, playerRotate, stage, hardDrop, togglePause]
  );

  useEffect(() => {
    window.addEventListener('keydown', move);
    window.addEventListener('keyup', keyUp);
    return () => {
      window.removeEventListener('keydown', move);
      window.removeEventListener('keyup', keyUp);
    };
  }, [move, keyUp]);

  useInterval(() => {
    drop();
  }, dropTime);
  
  // Auto-start
  useEffect(() => {
    if (resetTrigger === undefined || resetTrigger === 0) {
      startGame();
    }
  }, [startGame, resetTrigger]);

  return (
    <div 
      className={`flex flex-col lg:flex-row gap-6 sm:gap-10 w-full max-w-4xl mx-auto outline-none items-center justify-center lg:items-start ${isVsMode ? 'max-w-none' : ''}`}
      ref={gameAreaRef} 
      tabIndex={0}
    >
      <div className={`flex-1 w-full flex justify-center relative ${isVsMode ? '' : 'lg:justify-end'}`}>
        {isVsMode && (
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-zinc-400 font-bold text-xs uppercase z-10 whitespace-nowrap">
             Player
           </div>
        )}
        <Stage stage={stage} />
        {isPaused && !gameOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl flex-col gap-4">
             <div className="text-white text-4xl font-bold tracking-widest uppercase">Paused</div>
             <button 
               onClick={togglePause}
               className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors"
             >
               Resume
             </button>
          </div>
        )}
        {gameOver && isVsMode && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-900/40 backdrop-blur-sm rounded-sm">
             <div className="text-white text-2xl font-bold tracking-widest uppercase rotate-12 shadow-lg drop-shadow-xl text-red-500">You Died</div>
          </div>
        )}
      </div>

      <div className={`flex-1 flex flex-col gap-4 w-full ${isVsMode ? 'max-w-[200px]' : 'max-w-[300px]'}`}>
        {gameOver ? (
          <Display gameOver={gameOver} text="Game Over" value="You lost!" />
        ) : (
          <div className="flex flex-col gap-4">
            <Display text="Score" value={score} />
            <Display text="Rows" value={rows} />
            <Display text="Level" value={level} />
          </div>
        )}

        <div className="flex flex-col gap-3 mt-4">
          {!isVsMode && (
            <button
              className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-indigo-600/20 active:scale-95"
              onClick={startGame}
            >
              <RotateCcw size={20} />
              {gameOver ? 'Try Again' : 'Restart Game'}
            </button>
          )}
          
          <button
            className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors active:scale-95"
            onClick={togglePause}
            disabled={gameOver}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          {(!isVsMode || isPaused) && (
            <button
              className="flex items-center justify-center gap-2 px-8 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-100 rounded-lg font-bold transition-colors active:scale-95"
              onClick={() => {
                if (score > 0 && !gameOver) {
                  onGameOver(score, level);
                }
                onExit();
              }}
            >
              <Home size={20} />
              Main Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tetris;
