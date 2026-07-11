import { useState, useEffect, useRef } from 'react';
import { createStage } from '../lib/helpers';
import { PlayerState, StageState } from '../types';

export const useStage = (player: PlayerState, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    setRowsCleared(0);

    const prevStage = stageRef.current;
    const newStage = prevStage.map((row) =>
      row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
    ) as StageState;

    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const targetY = y + player.pos.y;
          const targetX = x + player.pos.x;
          if (newStage[targetY] && newStage[targetY][targetX]) {
            newStage[targetY][targetX] = [
              value,
              player.collided ? 'merged' : 'clear',
            ];
          }
        }
      });
    });

    if (player.collided) {
      let cleared = 0;
      const sweptStage = newStage.reduce((ack, row) => {
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          cleared += 1;
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
          return ack;
        }
        ack.push(row);
        return ack;
      }, [] as StageState);

      setStage(sweptStage);
      if (cleared > 0) {
        setRowsCleared(cleared);
      }
      resetPlayer();
    } else {
      setStage(newStage);
    }
  }, [player.collided, player.pos.x, player.pos.y, player.tetromino, resetPlayer]);

  return { stage, setStage, rowsCleared };
};
