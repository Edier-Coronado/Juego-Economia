import { Player } from "../types/game";
import { LADDERS, SNAKES, STARTING_MONEY, INITIAL_POSITION, PLAYER_COLORS, FINANCIAL_GOALS } from "../constants/gameConfig";

export const getRandomDiceRoll = (): number => {
  return Math.floor(Math.random() * 6) + 1;
};

export const getPositionAfterMoves = (position: number, diceRoll: number): number => {
  let newPosition = position + diceRoll;

  if (newPosition > 100) {
    newPosition = 100 - (newPosition - 100);
  }

  if (LADDERS[newPosition]) {
    newPosition = LADDERS[newPosition];
  } else if (SNAKES[newPosition]) {
    newPosition = SNAKES[newPosition];
  }

  return newPosition;
};

export const createPlayer = (id: string, name: string, colorIndex: number): Player => {
  const goal = FINANCIAL_GOALS[Math.floor(Math.random() * FINANCIAL_GOALS.length)];
  return {
    id,
    name,
    position: INITIAL_POSITION,
    money: STARTING_MONEY,
    color: PLAYER_COLORS[colorIndex].hex,
    goal,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getGridPosition = (position: number): { row: number; col: number } => {
  const boardSize = 10;
  const row = Math.floor((position - 1) / boardSize);
  let col = (position - 1) % boardSize;

  if (row % 2 === 1) {
    col = boardSize - 1 - col;
  }

  return { row: boardSize - 1 - row, col };
};

export const getBoardPosition = (row: number, col: number): number => {
  const boardSize = 10;
  const adjustedRow = boardSize - 1 - row;
  let position = adjustedRow * boardSize + col + 1;

  if (adjustedRow % 2 === 1) {
    position = adjustedRow * boardSize + (boardSize - 1 - col) + 1;
  }

  return position;
};

export const checkWinCondition = (player: Player): boolean => {
  return player.position === 100 && player.money >= player.goal.targetAmount;
};
