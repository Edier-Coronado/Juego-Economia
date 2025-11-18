import React from "react";
import { Card, Question } from "../types/game";
import { formatCurrency } from "../utils/gameLogic";

interface EventModalProps {
  isOpen: boolean;
  title: string;
  content: Card | Question | null;
  onClose: (answer?: string) => void;
  playerName: string;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  title,
  content,
  onClose,
  playerName,
}) => {
  if (!isOpen || !content) return null;

  const isQuestion = "question" in content;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl animate-in">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{(content as Card).icon}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{(content as Card).title}</h2>
          <p className="text-gray-600 text-sm">Turno de {playerName}</p>
        </div>

        {isQuestion ? (
          <div className="space-y-4">
            <p className="text-gray-700 font-semibold mb-4">{(content as Question).question}</p>
            <div className="space-y-2">
              {(content as Question).options.map((option, idx) => (
                <button
                  key={idx}
                  className="w-full p-3 text-left bg-gray-100 hover:bg-blue-100 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all"
                  onClick={() => onClose(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">{(content as Card).description}</p>
            <div
              className={`p-4 rounded-lg text-center font-bold text-xl animate-bounce ${
                (content as Card).type === "opportunity"
                  ? "bg-green-100 text-green-700 border-2 border-green-400"
                  : "bg-red-100 text-red-700 border-2 border-red-400"
              }`}
            >
              {(content as Card).type === "opportunity" ? "🎉 +" : "⚠ -"}{" "}
              {formatCurrency((content as Card).amount || 0)}
            </div>
            <button
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              onClick={() => onClose()}
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;
