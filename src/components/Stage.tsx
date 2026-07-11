import React from 'react';
import Cell from './Cell';
import { StageState } from '../types';

interface StageProps {
  stage: StageState;
  isBackground?: boolean;
}

const Stage: React.FC<StageProps> = ({ stage, isBackground }) => {
  return (
    <div
      className={`grid bg-zinc-900 rounded-sm p-1 gap-[1px] ${isBackground ? 'border-0' : 'border-4 border-zinc-800 shadow-2xl shadow-indigo-900/20'}`}
      style={{
        gridTemplateRows: `repeat(${stage.length}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${stage[0].length}, minmax(0, 1fr))`,
        width: '100%',
        maxWidth: isBackground ? '600px' : '350px',
        aspectRatio: '10 / 20',
      }}
    >
      {stage.map((row, y) =>
        row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />)
      )}
    </div>
  );
};
export default Stage;
