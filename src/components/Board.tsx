import React, { useEffect, useRef } from "react";
import { Player } from "../types/game";
import { LADDERS, SNAKES, BOARD_ROWS, BOARD_COLUMNS, EVENT_SQUARES } from "../constants/gameConfig";
import { getGridPosition } from "../utils/gameLogic";
import Tile from "./Tile";

interface BoardProps {
  players: Player[];
  animatingPlayer?: { id: string; targetPosition: number; progress: number };
}

const Board: React.FC<BoardProps> = ({ players, animatingPlayer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const TILE_SIZE = 60;
  const CANVAS_WIDTH = BOARD_COLUMNS * TILE_SIZE;
  const CANVAS_HEIGHT = BOARD_ROWS * TILE_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawBoard(ctx);
    drawLaddersAndSnakes(ctx);
  }, []);

  const getEventColor = (position: number): string => {
    const eventType = EVENT_SQUARES[position];
    if (eventType === "opportunity") {
      return "#d4edda";
    } else if (eventType === "challenge") {
      return "#f8d7da";
    } else if (eventType === "question") {
      return "#d1ecf1";
    }
    return "";
  };

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLUMNS; col++) {
        const position = getTileNumber(row, col);
        const eventColor = getEventColor(position);

        if (eventColor) {
          ctx.fillStyle = eventColor;
        } else {
          ctx.fillStyle = "#ffffff";
        }
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        if (position === 1 || position === 100) {
          ctx.fillStyle = position === 1 ? "#2ecc71" : "#f39c12";
          ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }

        ctx.strokeStyle = "#1a5276";
        ctx.lineWidth = 2;
        ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#1a5276";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          position.toString(),
          col * TILE_SIZE + TILE_SIZE / 2,
          row * TILE_SIZE + TILE_SIZE / 2 - 5
        );

        const eventType = EVENT_SQUARES[position];
        if (eventType === "opportunity") {
          ctx.fillStyle = "#27ae60";
          ctx.font = "bold 18px Arial";
          ctx.fillText("↑", col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2 + 12);
        } else if (eventType === "challenge") {
          ctx.fillStyle = "#c0392b";
          ctx.font = "bold 18px Arial";
          ctx.fillText("↓", col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2 + 12);
        } else if (eventType === "question") {
          ctx.fillStyle = "#0275d8";
          ctx.font = "bold 18px Arial";
          ctx.fillText("?", col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2 + 12);
        }

        if (position === 1) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px Arial";
          ctx.fillText("INICIO", col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2 + 22);
        }
        if (position === 100) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px Arial";
          ctx.fillText("FIN", col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2 + 22);
        }
      }
    }
  };

  const getTileNumber = (row: number, col: number): number => {
    const reverseRow = BOARD_ROWS - 1 - row;
    let tileNumber = reverseRow * BOARD_COLUMNS + col + 1;

    if (reverseRow % 2 === 1) {
      tileNumber = reverseRow * BOARD_COLUMNS + (BOARD_COLUMNS - 1 - col) + 1;
    }

    return tileNumber;
  };

  const drawLaddersAndSnakes = (ctx: CanvasRenderingContext2D) => {
    const drawConnection = (from: number, to: number, isLadder: boolean) => {
      const fromPos = getGridPosition(from);
      const toPos = getGridPosition(to);

      const fromX = fromPos.col * TILE_SIZE + TILE_SIZE / 2;
      const fromY = fromPos.row * TILE_SIZE + TILE_SIZE / 2;
      const toX = toPos.col * TILE_SIZE + TILE_SIZE / 2;
      const toY = toPos.row * TILE_SIZE + TILE_SIZE / 2;

      ctx.strokeStyle = isLadder ? "#27ae60" : "#e74c3c";
      ctx.lineWidth = 4;
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);

      const controlX = (fromX + toX) / 2 + (isLadder ? 20 : -20);
      const controlY = (fromY + toY) / 2;

      ctx.quadraticCurveTo(controlX, controlY, toX, toY);
      ctx.stroke();

      const arrowSize = 10;
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.fillStyle = isLadder ? "#27ae60" : "#e74c3c";
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    Object.entries(LADDERS).forEach(([from, to]) => {
      drawConnection(parseInt(from), to, true);
    });

    Object.entries(SNAKES).forEach(([from, to]) => {
      drawConnection(parseInt(from), to, false);
    });
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative bg-gradient-to-b from-blue-900 to-blue-800 p-6 rounded-lg shadow-2xl border-4 border-blue-600">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-white rounded border-2 border-blue-400"
        />
        {players.map((player) => {
          const pos = animatingPlayer?.id === player.id ? animatingPlayer.targetPosition : player.position;
          const gridPos = getGridPosition(pos);

          const playerIndex = players.indexOf(player);
          const playersAtPosition = players.filter((p) => p.position === player.position).length;
          const positionIndex = players.filter((p) => p.position === player.position && players.indexOf(p) <= playerIndex).length - 1;

          const offsetX = (positionIndex % 2) * 20 - 10;
          const offsetY = Math.floor(positionIndex / 2) * 20 - 10;

          return (
            <div
              key={player.id}
              className="absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg border-2 border-white transition-all duration-500"
              style={{
                left: `${gridPos.col * 60 + 30 + offsetX + 24}px`,
                top: `${gridPos.row * 60 + 30 + offsetY + 24}px`,
                backgroundColor: player.color,
              }}
              title={player.name}
            >
              {player.name.charAt(0)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
