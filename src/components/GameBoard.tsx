import React, { useState, useEffect } from "react";
import { Player, GameState } from "../types/game";
import { getRandomDiceRoll, getPositionAfterMoves, checkWinCondition, formatCurrency } from "../utils/gameLogic";
import { EVENT_SQUARES, OPPORTUNITIES, CHALLENGES, QUESTIONS, LADDERS, SNAKES } from "../constants/gameConfig";
import Board from "./Board";
import PlayerCard from "./PlayerCard";
import EventModal from "./EventModal";
import VictoryScreen from "./VictoryScreen";

interface GameBoardProps {
  gameState: GameState;
  onPlayerMove: (playerIndex: number, diceRoll: number, newPosition: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onPlayerMove }) => {
  const [diceRoll, setDiceRoll] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [displayedPlayers, setDisplayedPlayers] = useState(gameState.players);
  const [eventModal, setEventModal] = useState<{
    isOpen: boolean;
    title: string;
    content: any;
    type: "opportunity" | "challenge" | "question" | null;
  }>({ isOpen: false, title: "", content: null, type: null });
  
  const [globalNotification, setGlobalNotification] = useState<{
    message: string;
    type: 'gain' | 'loss';
    isVisible: boolean;
  }>({ message: '', type: 'gain', isVisible: false });

  useEffect(() => {
    setDisplayedPlayers(gameState.players);
  }, [gameState.players]);

  const currentPlayer = displayedPlayers[gameState.currentPlayerIndex];

  const movePlayerTile = async (startPos: number, endPos: number, playerIndex: number) => {
    return new Promise<void>((resolve) => {
      let currentPos = startPos;
      const step = startPos < endPos ? 1 : -1;

      const interval = setInterval(() => {
        currentPos += step;

        if (currentPos === endPos) {
          clearInterval(interval);
          resolve();
        } else {
          const updatedPlayers = [...displayedPlayers];
          updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], position: currentPos };
          setDisplayedPlayers(updatedPlayers);
        }
      }, 100);
    });
  };

  const handleRollDice = async () => {
    setIsRolling(true);
    setIsMoving(true);
    const roll = getRandomDiceRoll();
    setDiceRoll(roll);

    await new Promise((r) => setTimeout(r, 1000));

    const currentPos = displayedPlayers[gameState.currentPlayerIndex].position;
    let newPosition = currentPos + roll;

    if (newPosition > 100) {
      newPosition = 100 - (newPosition - 100);
    }

    await movePlayerTile(currentPos, newPosition, gameState.currentPlayerIndex);

    await new Promise((r) => setTimeout(r, 400));

    let finalPosition = newPosition;

    if (LADDERS[newPosition]) {
      await movePlayerTile(newPosition, LADDERS[newPosition], gameState.currentPlayerIndex);
      finalPosition = LADDERS[newPosition];
      await new Promise((r) => setTimeout(r, 300));
    } else if (SNAKES[newPosition]) {
      await movePlayerTile(newPosition, SNAKES[newPosition], gameState.currentPlayerIndex);
      finalPosition = SNAKES[newPosition];
      await new Promise((r) => setTimeout(r, 300));
    }

    const eventType = EVENT_SQUARES[finalPosition];
    if (eventType) {
      let event;
      let title = "";
      let moneyChange = 0;

      if (eventType === "opportunity") {
        event = OPPORTUNITIES[Math.floor(Math.random() * OPPORTUNITIES.length)];
        title = "¡Oportunidad!";
        moneyChange = event.amount || 0;
        
        // Mostrar notificación global
        setGlobalNotification({
          message: `+${formatCurrency(moneyChange)}`,
          type: 'gain',
          isVisible: true
        });
      } else if (eventType === "challenge") {
        event = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
        title = "Desafío Financiero";
        moneyChange = -(event.amount || 0);
        
        // Mostrar notificación global
        setGlobalNotification({
          message: `-${formatCurrency(event.amount || 0)}`,
          type: 'loss',
          isVisible: true
        });
      } else if (eventType === "question") {
        event = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        title = "Pregunta Económica";
      }

      // Actualizar el dinero en el estado local para mostrar cambios inmediatos
      const updatedPlayers = [...displayedPlayers];
      if (eventType !== "question") {
        updatedPlayers[gameState.currentPlayerIndex].money += moneyChange;
      }
      setDisplayedPlayers(updatedPlayers);

      setEventModal({
        isOpen: true,
        title,
        content: event,
        type: eventType,
      });
      
      // Ocultar notificación después de 3 segundos
      setTimeout(() => {
        setGlobalNotification(prev => ({ ...prev, isVisible: false }));
      }, 3000);
    } else {
      // Si no hay evento, proceder normalmente
      onPlayerMove(gameState.currentPlayerIndex, roll, finalPosition);
    }

    setIsRolling(false);
    setIsMoving(false);
  };

  const handleEventClose = (answer?: string) => {
    if (eventModal.type === "question" && answer) {
      const question = eventModal.content as any;
      const isCorrect = answer === question.correctAnswer;

      if (isCorrect) {
        const reward = question.reward || 0;
        
        // Actualizar el estado local
        const updatedPlayers = [...displayedPlayers];
        updatedPlayers[gameState.currentPlayerIndex].money += reward;
        setDisplayedPlayers(updatedPlayers);
        
        // Mostrar notificación por respuesta correcta
        setGlobalNotification({
          message: `+${formatCurrency(reward)} (Respuesta Correcta)`,
          type: 'gain',
          isVisible: true
        });
        
        setTimeout(() => {
          setGlobalNotification(prev => ({ ...prev, isVisible: false }));
        }, 3000);
      }
    }

    // Actualizar el estado principal con todos los cambios acumulados
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const currentPlayer = displayedPlayers[currentPlayerIndex];
    onPlayerMove(currentPlayerIndex, diceRoll, currentPlayer.position);

    setEventModal({ isOpen: false, title: "", content: null, type: null });
  };

  if (gameState.status === "finished" && gameState.winner) {
    return <VictoryScreen winner={gameState.winner} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      {/* Notificación Global de Cambios de Dinero */}
      {globalNotification.isVisible && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg font-bold text-white text-lg shadow-lg animate-bounce ${
            globalNotification.type === 'gain' 
              ? 'bg-green-500 border-2 border-green-300' 
              : 'bg-red-500 border-2 border-red-300'
          }`}
        >
          {globalNotification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Board players={displayedPlayers} animatingPlayer={undefined} />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-blue-500">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Estado del Juego</h2>
              <p className="text-gray-600 mb-2">
                Turno: <span className="font-bold text-lg text-blue-600">{currentPlayer?.name || ""}</span>
              </p>
              <p className="text-gray-600 mb-4">
                Dado: <span className="text-4xl font-bold text-yellow-500">{diceRoll || "-"}</span>
              </p>

              <button
                disabled={isRolling || isMoving || gameState.status !== "playing"}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform ${
                  isRolling || isMoving || gameState.status !== "playing"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 shadow-lg"
                }`}
                onClick={handleRollDice}
              >
                {isRolling || isMoving ? "🎲 Moviendo..." : "🎲 Lanzar Dado"}
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg">Jugadores</h3>
              {displayedPlayers.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrentTurn={index === gameState.currentPlayerIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <EventModal
        isOpen={eventModal.isOpen}
        title={eventModal.title}
        content={eventModal.content}
        onClose={handleEventClose}
        playerName={currentPlayer?.name || ""}
      />
    </div>
  );
};

export default GameBoard;
