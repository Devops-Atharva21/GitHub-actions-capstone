import React, { useState, useEffect } from 'react';
import { ScoreEntry } from '../types';
import { ArrowLeft, Trophy } from 'lucide-react';

interface LeaderboardProps {
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tetris_leaderboard');
    if (saved) {
      const parsed = JSON.parse(saved) as ScoreEntry[];
      setScores(parsed.sort((a, b) => b.score - a.score));
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 bg-zinc-900/40 p-8 rounded-2xl shadow-2xl border border-zinc-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="text-indigo-500" size={32} />
          <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Leaderboard</h2>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex flex-col bg-zinc-900/60 rounded-xl border border-zinc-800/50 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 bg-zinc-800/50 p-4 font-bold text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-800/50">
          <div>Rank</div>
          <div>Name</div>
          <div className="text-right">Score</div>
          <div className="text-right">Level</div>
          <div className="text-right">Date</div>
        </div>
        
        {scores.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No scores yet. Play a game to set a record!
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/30 max-h-[400px] overflow-y-auto space-y-1 p-2">
            {scores.map((entry, idx) => (
              <div key={entry.id} className={`grid grid-cols-5 gap-4 p-3 items-center rounded text-sm ${idx === 0 ? 'bg-indigo-500/5' : 'hover:bg-zinc-800/50'} transition-colors`}>
                <div className={`font-bold w-4 ${idx === 0 ? 'text-indigo-500' : 'text-zinc-500'}`}>
                  {idx + 1}
                </div>
                <div className="font-medium text-zinc-100 truncate" title={entry.name}>{entry.name}</div>
                <div className={`text-right font-mono font-bold ${idx === 0 ? 'text-indigo-400' : 'text-zinc-400'}`}>{entry.score.toLocaleString()}</div>
                <div className="text-right text-zinc-500">{entry.level}</div>
                <div className="text-right text-zinc-600 text-xs">{new Date(entry.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
