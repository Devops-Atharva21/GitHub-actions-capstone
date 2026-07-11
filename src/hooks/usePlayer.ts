import { useState, useCallback } from 'react';
import { randomTetromino, STAGE_WIDTH } from '../lib/constants';
import { checkCollision } from '../lib/helpers';
import { PlayerState, StageState, TetrominoType } from '../types';

export const usePlayer = (randomizeSpawn: boolean = false) => {
  const [player, setPlayer] = useState<PlayerState>({
    pos: { x: 0, y: 0 },
    tetromino: randomTetromino().shape,
    collided: false,
  });

  const rotate = (matrix: (TetrominoType | 0)[][], dir: number) => {
    // Make the rows to become cols (transpose)
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );
    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map((row) => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage: StageState, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    // Wall kick logic
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    let randomX = STAGE_WIDTH / 2 - 2;
    if (randomizeSpawn) {
      randomX = Math.floor(Math.random() * (STAGE_WIDTH - 4));
    }

    setPlayer({
      pos: { x: randomX, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, [randomizeSpawn]);

  return { player, updatePlayerPos, resetPlayer, playerRotate, setPlayer };
};
