import React from "react";
import { Player } from "../types/game";
import { formatCurrency } from "../utils/gameLogic";
import { Trophy, RotateCcw } from "lucide-react";

interface VictoryScreenProps {
  winner: Player;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ winner }) => {
  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="animate-bounce">
          <Trophy className="w-24 h-24 text-yellow-600 mx-auto" />
        </div>

        <div>
          <h1 className="text-5xl font-bold text-yellow-900 mb-2">¡GANADOR!</h1>
          <p className="text-3xl font-bold text-yellow-800">{winner.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Meta Alcanzada</p>
              <p className="text-2xl font-bold" style={{ color: winner.color }}>
                {winner.goal.icon} {winner.goal.name}
              </p>
            </div>

            <div className="border-t-2 border-gray-200 pt-4">
              <p className="text-gray-600 text-sm mb-1">Dinero Final</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(winner.money)}</p>
            </div>

            <div className="bg-gray-100 rounded p-4">
              <p className="text-sm text-gray-600 mb-1">Posición Final</p>
              <p className="text-2xl font-bold text-gray-800">{winner.position}/100</p>
            </div>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg"
          onClick={handlePlayAgain}
        >
          <RotateCcw className="w-5 h-5" />
          Jugar Nuevamente
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;
