import React from 'react';
import { TETROMINOES } from '../lib/constants';

interface CellProps {
  type: string | number;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  const tetromino = TETROMINOES[type as keyof typeof TETROMINOES];
  const color = tetromino ? tetromino.color : 'transparent';
  return (
    <div
      className={`w-full h-full ${
        type === 0 
          ? 'bg-zinc-800/20' 
          : `${color} shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]`
      }`}
    />
  );
};
export default React.memo(Cell);
