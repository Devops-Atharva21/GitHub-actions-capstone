import React, { useState, useEffect } from 'react';
import Tetris from './components/Tetris';
import VsGame from './components/VsGame';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import BotTetris from './components/BotTetris';
import { Controls, ScoreEntry } from './types';
import { Gamepad2, Trophy, Settings as SettingsIcon, Cpu } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'menu' | 'game' | 'settings' | 'leaderboard' | 'vs'>('menu');
  const [vsDifficulty, setVsDifficulty] = useState<'beginner' | 'good' | 'hard'>('beginner');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('tetris_theme');
    return saved ? saved === 'dark' : true;
  });
  const [newScore, setNewScore] = useState<{score: number, level: number} | null>(null);
  
  const [controls, setControls] = useState<Controls>(() => {
    const saved = localStorage.getItem('tetris_controls');
    return saved ? JSON.parse(saved) : {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      down: 'ArrowDown',
      rotate: 'ArrowUp',
      hardDrop: ' ',
      pause: 'Escape'
    };
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tetris_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tetris_theme', 'light');
    }
  }, [darkMode]);

  const saveControls = (newControls: Controls) => {
    setControls(newControls);
    localStorage.setItem('tetris_controls', JSON.stringify(newControls));
    setView('menu');
  };

  const handleGameOver = (score: number, level: number) => {
    setNewScore({ score, level });
  };

  const saveScore = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newScore) return;
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('playerName') as string;
    
    if (name.trim()) {
      const saved = localStorage.getItem('tetris_leaderboard');
      const leaderboard: ScoreEntry[] = saved ? JSON.parse(saved) : [];
      
      leaderboard.push({
        id: crypto.randomUUID(),
        name: name.trim().substring(0, 15),
        score: newScore.score,
        level: newScore.level,
        date: new Date().toISOString()
      });
      
      localStorage.setItem('tetris_leaderboard', JSON.stringify(leaderboard));
      setNewScore(null);
      setView('leaderboard');
    }
  };

  const startVsGame = (difficulty: 'beginner' | 'good' | 'hard') => {
    setVsDifficulty(difficulty);
    setView('vs');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-200 p-4 sm:p-8 flex items-center justify-center font-sans relative overflow-hidden">
      
      {view === 'menu' && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-100">
          <div className="w-full max-w-[600px] flex items-center justify-center">
             <BotTetris difficulty="good" isPaused={false} onGameOver={() => {}} isBackground={true} />
          </div>
        </div>
      )}

      {/* Game Over Score Submit Modal */}
      {newScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl shadow-indigo-900/20 w-full max-w-md border border-zinc-800 transform transition-all">
            <h3 className="text-2xl font-bold mb-2 text-center text-zinc-100">New High Score!</h3>
            <p className="text-center text-zinc-400 mb-6 font-mono">Score: <span className="text-indigo-400">{newScore.score.toLocaleString()}</span></p>
            <form onSubmit={saveScore} className="flex flex-col gap-4">
              <input 
                type="text" 
                name="playerName" 
                required 
                maxLength={15}
                placeholder="Enter your name" 
                className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg text-zinc-100"
                autoFocus
              />
              <div className="flex gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setNewScore(null)}
                  className="flex-1 px-8 py-3 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold transition-colors"
                >
                  Skip
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === 'menu' && (
        <div className="relative z-10 flex flex-col items-center justify-center gap-10 w-full max-w-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] rotate-3">
              <Gamepad2 size={36} className="text-white" />
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-sm mt-4">
              NEON <span className="text-indigo-500">TETRIS</span>
            </h1>
            <p className="text-zinc-500 text-center text-sm font-bold uppercase tracking-widest">
              The classic block puzzle game
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Classic Mode</h2>
              <button 
                onClick={() => setView('game')}
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
              >
                <Gamepad2 size={24} />
                Solo Play
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Vs Computer</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => startVsGame('beginner')}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-bold transition-all active:scale-[0.98]"
                >
                  <Cpu size={20} className="text-emerald-400" />
                  <span className="text-xs">Beginner</span>
                </button>
                <button 
                  onClick={() => startVsGame('good')}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-bold transition-all active:scale-[0.98]"
                >
                  <Cpu size={20} className="text-yellow-400" />
                  <span className="text-xs">Good</span>
                </button>
                <button 
                  onClick={() => startVsGame('hard')}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-bold transition-all active:scale-[0.98]"
                >
                  <Cpu size={20} className="text-red-400" />
                  <span className="text-xs">Hard</span>
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 md:col-span-2 pt-4 border-t border-zinc-800">
              <button 
                onClick={() => setView('leaderboard')}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-bold text-lg transition-all active:scale-[0.98]"
              >
                <Trophy size={24} className="text-indigo-400" />
                Leaderboard
              </button>
              <button 
                onClick={() => setView('settings')}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-bold text-lg transition-all active:scale-[0.98]"
              >
                <SettingsIcon size={24} className="text-zinc-400" />
                Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'game' && (
        <div className="w-full animate-in fade-in duration-300">
          <Tetris 
            controls={controls} 
            onGameOver={handleGameOver}
            onExit={() => setView('menu')}
          />
        </div>
      )}

      {view === 'vs' && (
        <div className="w-full animate-in fade-in duration-300">
          <VsGame 
            controls={controls} 
            difficulty={vsDifficulty}
            onExit={() => setView('menu')}
          />
        </div>
      )}

      {view === 'settings' && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Settings 
            controls={controls} 
            onSave={saveControls} 
            onBack={() => setView('menu')}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
          />
        </div>
      )}

      {view === 'leaderboard' && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Leaderboard onBack={() => setView('menu')} />
        </div>
      )}
    </div>
  );
}
