import React from 'react';

interface DisplayProps {
  gameOver?: boolean;
  text: string;
  value: string | number;
}

const Display: React.FC<DisplayProps> = ({ gameOver, text, value }) => {
  return (
    <div className={`bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 w-full flex flex-col items-start ${gameOver ? 'border-red-500 bg-red-500/5' : ''}`}>
      <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${gameOver ? 'text-red-500' : 'text-zinc-500'}`}>{text}</span>
      <span className={`text-xl sm:text-3xl font-mono font-bold ${gameOver ? 'text-red-500' : 'text-indigo-400'}`}>{value}</span>
    </div>
  );
};

export default Display;
