import React, { useState, useEffect } from 'react';
import Tetris from './Tetris';
import BotTetris from './BotTetris';
import { Controls } from '../types';
import { Home } from 'lucide-react';

interface VsGameProps {
  controls: Controls;
  difficulty: 'beginner' | 'good' | 'hard';
  onExit: () => void;
}

const VsGame: React.FC<VsGameProps> = ({ controls, difficulty, onExit }) => {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);

  const handlePlayerGameOver = (score: number, level: number) => {
    setPlayerScore(score);
    if (!winner) setWinner('bot');
  };

  const handleBotGameOver = (score: number) => {
    setBotScore(score);
    if (!winner) setWinner('player');
  };

  const resetMatch = () => {
    setWinner(null);
    setPlayerScore(0);
    setBotScore(0);
    setResetTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto gap-8">
      <div className="flex justify-between items-center w-full bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/50">
         <h2 className="text-xl font-bold text-zinc-100">VS COMPUTER <span className="text-indigo-400 text-sm ml-2">({difficulty.toUpperCase()})</span></h2>
         <button
            className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-100 rounded-lg font-bold transition-colors text-sm"
            onClick={onExit}
          >
            <Home size={16} />
            Exit Match
          </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-stretch">
        <div className="flex-1 flex justify-center relative">
           {winner === 'player' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-indigo-600 text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg shadow-indigo-500/20">
                 WINNER!
              </div>
           )}
           <Tetris 
             controls={controls} 
             onGameOver={handlePlayerGameOver} 
             onExit={onExit} 
             isVsMode={true}
             resetTrigger={resetTrigger}
           />
        </div>
        
        <div className="hidden md:flex items-center justify-center">
           <div className="w-px h-full bg-zinc-800/50"></div>
        </div>

        <div className="flex-1 flex justify-center relative">
           {winner === 'bot' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-600 text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg shadow-red-500/20">
                 WINNER!
              </div>
           )}
           <BotTetris 
             difficulty={difficulty} 
             isPaused={winner !== null} 
             onGameOver={handleBotGameOver}
             resetTrigger={resetTrigger}
           />
        </div>
      </div>

      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
           <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 text-center flex flex-col items-center gap-6 max-w-sm w-full">
              <h2 className="text-4xl font-black text-white tracking-tight">
                {winner === 'player' ? <span className="text-indigo-400">YOU WON!</span> : <span className="text-red-500">BOT WON</span>}
              </h2>
              <div className="flex w-full justify-between items-center text-zinc-400 font-mono text-sm">
                <span>Player: {playerScore}</span>
                <span>Bot: {botScore}</span>
              </div>
              <div className="flex gap-4 w-full mt-2">
                 <button 
                   onClick={onExit}
                   className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-bold transition-colors"
                 >
                   Quit
                 </button>
                 <button 
                   onClick={resetMatch}
                   className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-indigo-600/20"
                 >
                   Rematch
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VsGame;
