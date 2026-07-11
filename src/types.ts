export type TetrominoType = 0 | 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type Tetromino = {
  shape: (TetrominoType | 0)[][];
  color: string;
};

export type PlayerState = {
  pos: { x: number; y: number };
  tetromino: (TetrominoType | 0)[][];
  collided: boolean;
};

export type CellContext = [TetrominoType | 0, string];
export type StageState = CellContext[][];

export type Controls = {
  left: string;
  right: string;
  down: string;
  rotate: string;
  hardDrop: string;
  pause: string;
};

export type ScoreEntry = {
  id: string;
  name: string;
  score: number;
  level: number;
  date: string;
};
