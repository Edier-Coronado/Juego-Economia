import { useState } from "react";
import { GameState, Player } from "./types/game";
import { createPlayer, checkWinCondition } from "./utils/gameLogic";
import GameSetup from "./components/GameSetup";
import GameBoard from "./components/GameBoard";

function App() {
  const [gameState, setGameState] = useState<GameState>({
    status: "setup",
    players: [],
    currentPlayerIndex: 0,
  });

  const handleGameStart = (playerNames: string[]) => {
    const players = playerNames.map((name, index) =>
      createPlayer(`player-${index}`, name, index)
    );

    setGameState({
      status: "playing",
      players,
      currentPlayerIndex: 0,
    });
  };

  const handlePlayerMove = (playerIndex: number, diceRoll: number, newPosition: number) => {
    setGameState(prevState => {
      const updatedPlayers = [...prevState.players];
      
      // Actualizar posición y mantener el dinero actual
      updatedPlayers[playerIndex] = { 
        ...updatedPlayers[playerIndex], 
        position: newPosition
      };
      
      const updatedPlayer = updatedPlayers[playerIndex];

      if (checkWinCondition(updatedPlayer)) {
        return {
          ...prevState,
          players: updatedPlayers,
          status: "finished",
          winner: updatedPlayer,
        };
      } else {
        const nextPlayerIndex = (playerIndex + 1) % updatedPlayers.length;
        return {
          ...prevState,
          players: updatedPlayers,
          currentPlayerIndex: nextPlayerIndex,
        };
      }
    });
  };

  return (
    <>
      {gameState.status === "setup" && <GameSetup onStart={handleGameStart} />}
      {gameState.status !== "setup" && (
        <GameBoard gameState={gameState} onPlayerMove={handlePlayerMove} />
      )}
    </>
  );
}

export default App;
