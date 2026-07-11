import React, { useState, useEffect } from 'react';
import { Controls } from '../types';
import { ArrowLeft, Save } from 'lucide-react';

interface SettingsProps {
  controls: Controls;
  onSave: (controls: Controls) => void;
  onBack: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const keyDisplay = (key: string) => {
  if (key === ' ') return 'Space';
  if (key.startsWith('Arrow')) return key.replace('Arrow', '') + ' Arrow';
  return key;
};

const Settings: React.FC<SettingsProps> = ({ controls, onSave, onBack, darkMode, toggleDarkMode }) => {
  const [localControls, setLocalControls] = useState<Controls>(controls);
  const [listeningFor, setListeningFor] = useState<keyof Controls | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (listeningFor) {
        e.preventDefault();
        setLocalControls((prev) => ({ ...prev, [listeningFor]: e.key }));
        setListeningFor(null);
      }
    };

    if (listeningFor) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listeningFor]);

  const handleSave = () => {
    onSave(localControls);
  };

  const controlLabels: Record<keyof Controls, string> = {
    left: 'Move Left',
    right: 'Move Right',
    down: 'Soft Drop',
    rotate: 'Rotate',
    hardDrop: 'Hard Drop',
    pause: 'Pause/Resume',
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 bg-zinc-900/40 p-8 rounded-2xl shadow-2xl border border-zinc-800/50">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Settings</h2>
        <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between p-5 bg-zinc-900/60 rounded-xl border border-zinc-800/50">
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-100">Dark Mode</span>
            <span className="text-sm text-zinc-500">Toggle application theme (Neon theme forces dark)</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`w-14 h-7 rounded-full p-1 transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-zinc-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Keyboard Controls</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(controlLabels) as Array<keyof Controls>).map((key) => (
              <div key={key} className="flex items-center justify-between bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/50">
                <span className="font-medium text-zinc-400 text-sm">{controlLabels[key]}</span>
                <button
                  onClick={() => setListeningFor(key)}
                  className={`px-4 py-2 rounded-lg border font-mono text-xs transition-colors ${
                    listeningFor === key 
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' 
                      : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                  }`}
                >
                  {listeningFor === key ? 'Press a key...' : keyDisplay(localControls[key])}
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
