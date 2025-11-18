import React, { useState, useEffect } from "react";
import { Player } from "../types/game";
import { formatCurrency } from "../utils/gameLogic";

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isCurrentTurn }) => {
  const [moneyChange, setMoneyChange] = useState<number | null>(null);
  const [previousMoney, setPreviousMoney] = useState(player.money);
  const moneyNeeded = player.goal.targetAmount - player.money;
  const moneyPercentage = Math.min((player.money / player.goal.targetAmount) * 100, 100);

  // Detectar cambios en el dinero
  useEffect(() => {
    if (player.money !== previousMoney) {
      const change = player.money - previousMoney;
      setMoneyChange(change);
      setPreviousMoney(player.money);
      
      // Remover la animación después de 2 segundos
      const timer = setTimeout(() => {
        setMoneyChange(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [player.money, previousMoney]);

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all relative overflow-hidden ${
        isCurrentTurn
          ? "border-yellow-400 bg-yellow-50 shadow-lg scale-105"
          : "border-gray-300 bg-white"
      }`}
      style={{ borderColor: isCurrentTurn ? "#f39c12" : "inherit" }}
    >
      {/* Indicador de cambio de dinero */}
      {moneyChange !== null && (
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold animate-pulse ${
            moneyChange > 0 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {moneyChange > 0 ? "+" : ""}{formatCurrency(moneyChange)}
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: player.color }}
        />
        <h3 className="font-bold text-lg">{player.name}</h3>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        <p>Posición: <span className="font-semibold">{player.position}/100</span></p>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold">{player.goal.icon} {player.goal.name}</span>
          <span className="text-xs text-gray-600">{Math.round(moneyPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${moneyPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Falta: {formatCurrency(Math.max(moneyNeeded, 0))}
        </p>
      </div>

      <div 
        className={`text-right font-bold text-lg transition-all duration-300 ${
          moneyChange !== null 
            ? moneyChange > 0 
              ? "text-green-600 scale-110" 
              : "text-red-600 scale-110"
            : player.money < 0 
              ? "text-red-600"
              : ""
        }`}
        style={{ color: moneyChange === null && player.money >= 0 ? player.color : undefined }}
      >
        {formatCurrency(player.money)}
      </div>
    </div>
  );
};

export default PlayerCard;
