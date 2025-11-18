import React from "react";

interface TileProps {
  number: number;
  isLight: boolean;
  hasLadder: boolean;
  hasSnake: boolean;
}

const Tile: React.FC<TileProps> = ({ number, isLight, hasLadder, hasSnake }) => {
  return (
    <div
      className={`w-16 h-16 flex items-center justify-center font-bold text-lg border-2 border-blue-900 ${
        isLight ? "bg-green-200" : "bg-green-300"
      }`}
    >
      <div className="flex flex-col items-center">
        <span className="text-blue-900">{number}</span>
        {hasLadder && <span className="text-xl">🔼</span>}
        {hasSnake && <span className="text-xl">🐍</span>}
      </div>
    </div>
  );
};

export default Tile;
