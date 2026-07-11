import React, { useState, useEffect, useCallback } from 'react';
import { createStage, checkCollision } from '../lib/helpers';
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import Stage from './Stage';
import Display from './Display';
import { getBestMove } from '../lib/ai';

interface BotTetrisProps {
  difficulty: 'beginner' | 'good' | 'hard';
  isPaused: boolean;
  onGameOver: (score: number) => void;
  resetTrigger?: number;
  isBackground?: boolean;
}

const BotTetris: React.FC<BotTetrisProps> = ({ difficulty, isPaused, onGameOver, resetTrigger, isBackground }) => {
  const [gameOver, setGameOver] = useState(false);
  const [targetMove, setTargetMove] = useState<{rotation: number, x: number} | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [thinkCounter, setThinkCounter] = useState(0);

  const { player, updatePlayerPos, resetPlayer, playerRotate, setPlayer } = usePlayer(isBackground);
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);

  const startGame = useCallback(() => {
    setStage(createStage());
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    setTargetMove(null);
    setCurrentRotation(0);
    setThinkCounter(0);
  }, [resetPlayer, setLevel, setRows, setScore, setStage]);

  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      startGame();
    }
  }, [resetTrigger, startGame]);

  // Auto-start
  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (gameOver && isBackground) {
      const timer = setTimeout(() => {
        startGame();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameOver, isBackground, startGame]);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const hardDrop = () => {
    let tmpY = 0;
    while (!checkCollision(player, stage, { x: 0, y: tmpY + 1 })) {
      tmpY += 1;
    }
    updatePlayerPos({ x: 0, y: tmpY, collided: true });
    setTargetMove(null);
    setCurrentRotation(0);
  };

  const drop = () => {
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        onGameOver(score);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
      setTargetMove(null);
      setCurrentRotation(0);
    }
  };

  const baseSpeed = 1000 / (level + 1) + 200;
  let actionDelay = difficulty === 'hard' ? Math.max(100, baseSpeed / 3) : difficulty === 'good' ? Math.max(200, baseSpeed / 2) : Math.max(400, baseSpeed);
  if (isBackground) actionDelay = 150; // medium fast constant speed

  useInterval(() => {
    if (gameOver || isPaused || player.collided) return;

    if (!targetMove) {
       const requiredThinkTicks = difficulty === 'hard' ? 1 : difficulty === 'good' ? 2 : 3;
       if (thinkCounter < requiredThinkTicks) {
          setThinkCounter(prev => prev + 1);
          return;
       }
       const move = getBestMove(player, stage, difficulty);
       setTargetMove(move);
       setCurrentRotation(0);
       setThinkCounter(0);
       return;
    }

    if (currentRotation < targetMove.rotation) {
       playerRotate(stage, 1);
       setCurrentRotation(prev => prev + 1);
    } else if (player.pos.x > targetMove.x) {
       if (!checkCollision(player, stage, { x: -1, y: 0 })) {
         movePlayer(-1);
       } else {
         drop();
       }
    } else if (player.pos.x < targetMove.x) {
       if (!checkCollision(player, stage, { x: 1, y: 0 })) {
         movePlayer(1);
       } else {
         drop();
       }
    } else {
       drop();
    }
  }, gameOver || isPaused ? null : actionDelay);

  return (
    <div className={`flex flex-col w-full ${isBackground ? '' : 'max-w-[350px] items-center gap-4'}`}>
      {!isBackground && (
        <div className="flex justify-between w-full text-zinc-400 font-bold text-xs uppercase px-2 items-center">
          <span>Bot ({difficulty})</span>
          <div className="flex items-center gap-4">
            {!targetMove && !gameOver && (
               <span className="text-yellow-500 animate-pulse text-[10px]">Thinking...</span>
            )}
            <span>Score: <span className="text-indigo-400">{score.toLocaleString()}</span></span>
          </div>
        </div>
      )}
      
      <div className={`w-full relative ${isBackground ? 'opacity-60' : 'opacity-90'}`}>
        <Stage stage={stage} isBackground={isBackground} />
        {gameOver && !isBackground && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-900/40 backdrop-blur-sm rounded-sm">
             <div className="text-white text-2xl font-bold tracking-widest uppercase rotate-12 shadow-lg drop-shadow-xl text-red-500">Bot Died</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotTetris;
