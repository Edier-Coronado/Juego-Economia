export interface Player {
  id: string;
  name: string;
  position: number;
  money: number;
  color: string;
  goal: FinancialGoal;
}

export interface FinancialGoal {
  name: string;
  icon: string;
  targetAmount: number;
}

export interface Card {
  type: "opportunity" | "challenge" | "question";
  title: string;
  description: string;
  amount?: number;
  icon: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  reward: number;
}

export interface GameState {
  status: "setup" | "playing" | "finished";
  players: Player[];
  currentPlayerIndex: number;
  winner?: Player;
  gameId?: string;
}

export interface SpecialSquare {
  position: number;
  type: "ladder" | "snake" | "event";
  connects?: number;
}
