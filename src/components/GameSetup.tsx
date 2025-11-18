import React, { useState } from "react";
import { Dices } from "lucide-react";

interface GameSetupProps {
  onStart: (playerNames: string[]) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(["Jugador 1", "Jugador 2"]);
  const [showInstructions, setShowInstructions] = useState(true);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array.from({ length: count }, (_, i) => `Jugador ${i + 1}`));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const validNames = playerNames.filter((name) => name.trim());
    if (validNames.length === playerCount) {
      onStart(validNames);
    }
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Dices className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">Economía en Acción</h1>
            </div>

            <div className="space-y-6 text-gray-700">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-lg">
                  <strong>¡Bienvenido!</strong> Este es un juego educativo interactivo donde aprenderás sobre finanzas personales mientras juegas. Es similar a Serpientes y Escaleras, pero con dinero y decisiones económicas.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-3 text-blue-600">🎯 ¿De Qué Trata el Juego?</h3>
                <p className="mb-3">
                  En este juego compites con otros jugadores para ser el primero en llegar a la casilla 100 del tablero. Pero no solo se trata de llegar primero: también necesitas acumular dinero suficiente para alcanzar tu objetivo financiero (como comprar una casa, un auto o pagar educación).
                </p>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  Aprenderás conceptos reales de finanzas como el ahorro, la inflación, los intereses, el presupuesto y muchas más estrategias económicas.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-3 text-blue-600">📋 Objetivo Principal</h3>
                <div className="bg-gray-50 p-4 rounded space-y-2">
                  <p>✓ <strong>Llegar a la casilla 100</strong> del tablero</p>
                  <p>✓ <strong>Tener suficiente dinero</strong> para tu meta financiera personal</p>
                  <p className="text-sm text-gray-600">Ambas condiciones deben cumplirse para ganar</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-3 text-blue-600">🎮 Cómo Se Juega (Paso a Paso)</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold">1. El Turno de Cada Jugador</p>
                    <p className="text-sm text-gray-600">Cuando es tu turno, presionas el botón "Lanzar Dado" para rodar un dado virtual que te dará un número entre 1 y 6.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold">2. Avanzar en el Tablero</p>
                    <p className="text-sm text-gray-600">Tu ficha se mueve automáticamente el número de casillas que salió en el dado. Verás la animación de tu movimiento.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold">3. Escaleras (Buena Suerte ↑)</p>
                    <p className="text-sm text-gray-600">Si caes en la base de una escalera, ¡subes automáticamente hacia arriba! Esto te ayuda a avanzar más rápido.</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-semibold">4. Serpientes (Mala Suerte ↓)</p>
                    <p className="text-sm text-gray-600">Si caes en la cabeza de una serpiente, bajas hacia su cola. Esto te retrocede en el tablero (como una multa o gasto inesperado).</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="font-semibold">5. Casillas Especiales</p>
                    <p className="text-sm text-gray-600">Algunas casillas tienen eventos especiales:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                      <li><span className="text-green-600 font-semibold">Casilla Verde (Oportunidad)</span> - Ganas dinero</li>
                      <li><span className="text-red-600 font-semibold">Casilla Roja (Desafío)</span> - Pierdes dinero</li>
                      <li><span className="text-blue-600 font-semibold">Casilla Azul (Pregunta)</span> - Debes responder correctamente para ganar dinero</li>
                    </ul>
                  </div>
                </div>
              </div>

// En la sección "Sistema de Dinero", busca esta parte y reemplázala:
              <div>
                <h3 className="font-bold text-xl mb-3 text-blue-600">💰 Sistema de Dinero (Muy Importante)</h3>
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-300 p-3 rounded">
                    <p className="font-semibold mb-2">Comienzas con $0</p>
                    <p className="text-sm">Tu objetivo es acumular dinero a través del juego. El dinero se gana o pierde de varias formas.</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Ganas dinero cuando:</strong></p>
                    <ul className="list-disc list-inside bg-green-50 p-2 rounded">
                      <li>Caes en una casilla de Oportunidad (verde)</li>
                      <li>Respondes correctamente una Pregunta Económica (azul)</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Pierdes dinero cuando:</strong></p>
                    <ul className="list-disc list-inside bg-red-50 p-2 rounded">
                      <li>Caes en una casilla de Desafío (roja)</li>
                      <li>Respondes incorrectamente una Pregunta Económica</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <p className="text-sm font-semibold text-red-700">⚠️ ¡Cuidado! Tu dinero puede volverse negativo si acumulas muchas deudas.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-3 text-blue-600">❓ Las Preguntas Económicas</h3>
                <div className="bg-blue-50 p-4 rounded space-y-3">
                  <p>
                    Cuando caes en una casilla azul, aparecerá una pregunta sobre finanzas personales. Son preguntas que aprenderás durante el juego.
                  </p>
                  <p className="font-semibold">Ejemplo de pregunta:</p>
                  <div className="bg-white border border-blue-200 p-3 rounded text-sm">
                    <p className="font-semibold mb-2">"¿Qué es presupuestar?"</p>
                    <p className="mb-2">A. Hacer un plan de gastos e ingresos</p>
                    <p className="mb-2">B. Pedir dinero prestado</p>
                    <p className="mb-2">C. Invertir en bolsa</p>
                    <p>D. Evadir impuestos</p>
                    <p className="mt-2 text-green-600"><strong>Respuesta correcta: A</strong></p>
                  </div>
                  <p className="text-sm">
                    Si respondes correctamente, ganas $5.000 adicionales. Si fallas, no ganas dinero pero puedes seguir jugando.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-3 text-blue-600">🏆 Cómo Ganar</h3>
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <p className="mb-2">Para ganar el juego, debes cumplir DOS condiciones al mismo tiempo:</p>
                  <p className="font-semibold mb-2">1. Llegar a la casilla 100</p>
                  <p className="text-sm mb-3">Sé el primero en alcanzar la casilla final del tablero.</p>
                  <p className="font-semibold mb-2">2. Tener tu meta financiera</p>
                  <p className="text-sm">Cada jugador tiene una meta (por ejemplo: $100.000 para una casa). Debes tener ese dinero acumulado.</p>
                  <p className="text-sm mt-2 text-gray-600">Cuando logras ambas cosas, ¡celebras tu victoria! 🎉</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-3 text-blue-600">💡 Consejos para Jugar Bien</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Presta atención a las preguntas económicas: son oportunidades para ganar dinero extra</li>
                  <li>✓ Aprende de cada pregunta: los conceptos se repiten</li>
                  <li>✓ Mira cuánto dinero tienen los otros jugadores para saber si vas ganando</li>
                  <li>✓ La suerte importa, pero las decisiones económicas también</li>
                </ul>
              </div>

              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> Este juego es educativo. Mientras te diviertes, aprenderás conceptos reales sobre finanzas que puedes usar en tu vida real.
                </p>
              </div>
            </div>

            <button
              className="w-full mt-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all text-lg"
              onClick={() => setShowInstructions(false)}
            >
              Entendido, Continuar a la Configuración →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Configurar Juego
        </h1>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-4">
            Número de Jugadores
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                className={`py-2 rounded-lg font-bold transition-all ${playerCount === count
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                onClick={() => handlePlayerCountChange(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <label className="block text-gray-700 font-semibold">Nombres de Jugadores</label>
          {playerNames.map((name, index) => (
            <input
              key={index}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Jugador ${index + 1}`}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          ))}
        </div>

        <div className="space-y-2">
          <button
            className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all"
            onClick={handleStart}
          >
            Comenzar Juego
          </button>
          <button
            className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            onClick={() => setShowInstructions(true)}
          >
            Ver Instrucciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
