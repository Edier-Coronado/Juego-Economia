import React, { useState, useEffect } from "react";
import { Player, GameState } from "../types/game";
import { getRandomDiceRoll, checkWinCondition, formatCurrency } from "../utils/gameLogic";
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
      const totalSteps = Math.abs(endPos - startPos);

      let stepCount = 0;
      const interval = setInterval(() => {
        if (stepCount >= totalSteps) {
          clearInterval(interval);
          
          // Asegurar que termina en la posición correcta
          const updatedPlayers = [...displayedPlayers];
          updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], position: endPos };
          setDisplayedPlayers(updatedPlayers);
          
          resolve();
          return;
        }

        currentPos += step;
        stepCount++;

        const updatedPlayers = [...displayedPlayers];
        updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], position: currentPos };
        setDisplayedPlayers(updatedPlayers);
      }, 200);
    });
  };

  const handleRollDice = async () => {
    if (isRolling || isMoving || gameState.status !== "playing") return;

    setIsRolling(true);
    setIsMoving(true);
    
    const roll = getRandomDiceRoll();
    setDiceRoll(roll);

    // Animación del dado
    await new Promise((r) => setTimeout(r, 1000));

    const currentPlayerIndex = gameState.currentPlayerIndex;
    const currentPos = displayedPlayers[currentPlayerIndex].position;
    
    // CALCULAR NUEVA POSICIÓN CORRECTAMENTE
    let newPosition = currentPos + roll;

    // Si se pasa de 100, rebota
    if (newPosition > 100) {
      newPosition = 100 - (newPosition - 100);
    }

    // Mover al jugador a la nueva posición
    await movePlayerTile(currentPos, newPosition, currentPlayerIndex);
    await new Promise((r) => setTimeout(r, 500));

    let finalPosition = newPosition;

    // Verificar escaleras
    if (LADDERS[newPosition]) {
      const ladderEnd = LADDERS[newPosition];
      await movePlayerTile(newPosition, ladderEnd, currentPlayerIndex);
      finalPosition = ladderEnd;
      await new Promise((r) => setTimeout(r, 500));
    } 
    // Verificar serpientes
    else if (SNAKES[newPosition]) {
      const snakeEnd = SNAKES[newPosition];
      await movePlayerTile(newPosition, snakeEnd, currentPlayerIndex);
      finalPosition = snakeEnd;
      await new Promise((r) => setTimeout(r, 500));
    }

    // Verificar eventos en la casilla final
    const eventType = EVENT_SQUARES[finalPosition];
    if (eventType) {
      let event;
      let title = "";
      let moneyChange = 0;

      if (eventType === "opportunity") {
        event = OPPORTUNITIES[Math.floor(Math.random() * OPPORTUNITIES.length)];
        title = "¡Oportunidad!";
        moneyChange = event.amount || 0;
        
        setGlobalNotification({
          message: `+${formatCurrency(moneyChange)}`,
          type: 'gain',
          isVisible: true
        });
      } else if (eventType === "challenge") {
        event = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
        title = "Desafío Financiero";
        moneyChange = -(event.amount || 0);
        
        setGlobalNotification({
          message: `-${formatCurrency(Math.abs(moneyChange))}`,
          type: 'loss',
          isVisible: true
        });
      } else if (eventType === "question") {
        event = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        title = "Pregunta Económica";
      }

      // Actualizar dinero localmente
      if (eventType !== "question") {
        const updatedPlayers = [...displayedPlayers];
        updatedPlayers[currentPlayerIndex].money += moneyChange;
        setDisplayedPlayers(updatedPlayers);
      }

      setEventModal({
        isOpen: true,
        title,
        content: event,
        type: eventType,
      });

      setTimeout(() => {
        setGlobalNotification(prev => ({ ...prev, isVisible: false }));
      }, 3000);
    } else {
      // Si no hay evento, actualizar estado principal inmediatamente
      onPlayerMove(currentPlayerIndex, roll, finalPosition);
    }

    setIsRolling(false);
    setIsMoving(false);
  };

  const handleEventClose = (answer?: string) => {
    const currentPlayerIndex = gameState.currentPlayerIndex;
    const currentPlayer = displayedPlayers[currentPlayerIndex];

    if (eventModal.type === "question" && answer) {
      const question = eventModal.content;
      const isCorrect = answer === question.correctAnswer;

      if (isCorrect) {
        const reward = question.reward || 0;
        const updatedPlayers = [...displayedPlayers];
        updatedPlayers[currentPlayerIndex].money += reward;
        setDisplayedPlayers(updatedPlayers);
        
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

    // Actualizar estado principal con la posición y dinero actual
    onPlayerMove(currentPlayerIndex, diceRoll, currentPlayer.position);

    setEventModal({ isOpen: false, title: "", content: null, type: null });
  };

  if (gameState.status === "finished" && gameState.winner) {
    return <VictoryScreen winner={gameState.winner} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
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

npm run build
npm run deploy
