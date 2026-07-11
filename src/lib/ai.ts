import { STAGE_WIDTH, STAGE_HEIGHT } from './constants';
import { checkCollision } from './helpers';
import { PlayerState, StageState, TetrominoType } from '../types';

export const rotateMatrix = (matrix: (TetrominoType | 0)[][], dir: number) => {
  const rotatedTetro = matrix.map((_, index) =>
    matrix.map((col) => col[index])
  );
  if (dir > 0) return rotatedTetro.map((row) => row.reverse());
  return rotatedTetro.reverse();
};

const evaluateBoard = (stage: StageState) => {
  let aggregateHeight = 0;
  let holes = 0;
  let bumpiness = 0;
  let completeLines = 0;
  const heights = new Array(STAGE_WIDTH).fill(0);

  for (let c = 0; c < STAGE_WIDTH; c++) {
    let blockFound = false;
    for (let r = 0; r < STAGE_HEIGHT; r++) {
      if (stage[r][c][0] !== 0) {
        if (!blockFound) {
          heights[c] = STAGE_HEIGHT - r;
          aggregateHeight += heights[c];
          blockFound = true;
        }
      } else if (blockFound && stage[r][c][0] === 0) {
        holes++;
      }
    }
  }

  for (let c = 0; c < STAGE_WIDTH - 1; c++) {
    bumpiness += Math.abs(heights[c] - heights[c + 1]);
  }

  for (let r = 0; r < STAGE_HEIGHT; r++) {
    let isComplete = true;
    for (let c = 0; c < STAGE_WIDTH; c++) {
      if (stage[r][c][0] === 0) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) completeLines++;
  }

  const a = -0.510066;
  const b = 0.760666;
  const c = -0.35663;
  const d = -0.184483;

  return a * aggregateHeight + b * completeLines + c * holes + d * bumpiness;
};

export const getBestMove = (player: PlayerState, stage: StageState, difficulty: 'beginner' | 'good' | 'hard') => {
  let bestScore = -Infinity;
  let bestMove = { rotation: 0, x: player.pos.x };

  if (difficulty === 'beginner' && Math.random() < 0.2) {
    // 20% chance to just drop it randomly for beginner
    return {
      rotation: Math.floor(Math.random() * 4),
      x: Math.floor(Math.random() * (STAGE_WIDTH - player.tetromino[0].length))
    };
  }

  let currentTetromino = player.tetromino;

  for (let rotation = 0; rotation < 4; rotation++) {
    for (let x = -3; x < STAGE_WIDTH; x++) {
      let testPlayer = { ...player, pos: { x, y: player.pos.y }, tetromino: currentTetromino };
      
      if (checkCollision(testPlayer, stage, { x: 0, y: 0 })) {
        continue; 
      }

      // Check if path is horizontally clear from current y
      let pathClear = true;
      const step = x > player.pos.x ? 1 : -1;
      let tempX = player.pos.x;
      while (tempX !== x) {
        tempX += step;
        let testP = { ...player, pos: { x: tempX, y: player.pos.y }, tetromino: currentTetromino };
        if (checkCollision(testP, stage, {x: 0, y: 0})) {
           pathClear = false;
           break;
        }
      }
      if (!pathClear) continue;

      let y = player.pos.y;
      while (!checkCollision(testPlayer, stage, { x: 0, y: y - player.pos.y + 1 })) {
        y++;
      }
      testPlayer.pos.y = y;

      const testStage = stage.map(row => row.map(cell => cell[1] === 'clear' ? [0, 'clear'] : [...cell])) as StageState;
      let placed = false;
      for (let r = 0; r < testPlayer.tetromino.length; r++) {
        for (let c = 0; c < testPlayer.tetromino[r].length; c++) {
          if (testPlayer.tetromino[r][c] !== 0) {
            const targetY = r + testPlayer.pos.y;
            const targetX = c + testPlayer.pos.x;
            if (testStage[targetY] && testStage[targetY][targetX]) {
               testStage[targetY][targetX] = [testPlayer.tetromino[r][c], 'merged'];
               placed = true;
            }
          }
        }
      }

      if (placed) {
        let score = evaluateBoard(testStage);
        if (difficulty === 'good') {
          score += (Math.random() * 1.5 - 0.75); // some noise
        }
        if (score > bestScore) {
          bestScore = score;
          bestMove = { rotation, x };
        }
      }
    }
    currentTetromino = rotateMatrix(currentTetromino, 1);
  }

  return bestMove;
};
