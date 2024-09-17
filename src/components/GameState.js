import React, { useState, useEffect } from "react";
import GamePieces from "./GamePieces";

const GameState = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [collisionType, setCollisionType] = useState(null);

  const handleGameOver = (type) => {
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }

    setCollisionType(type);
  };

  const handleResetGame = () => {
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver && e.key === "Enter") {
        handleResetGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [gameOver]);

  
  const getBackgroundGradient = () => {
    if (score < 10) return "from-blue-300 to-blue-500";   
    if (score < 20) return "from-indigo-300 to-indigo-600"; 
    if (score < 45) return "from-green-300 to-green-500"; 
    if (score < 80) return "from-yellow-300 to-yellow-500"; 
    if (score < 125) return "from-orange-300 to-orange-600"; 
    return "from-red-300 to-red-600"; 
  };
  

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen bg-gradient-to-r ${getBackgroundGradient()}`}
    >
      <div className="text-center mb-5">
        <p className="text-xl font-bold text-white">Score: {score}</p>
        <p className="text-lg text-white">High Score: {highScore}</p>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-1/2">
      {gameOver ? (
  <div className="text-center bg-red-200 p-4 rounded-md">
    <p className="text-xl font-semibold text-red-600">
      Game Over! {collisionType === "wall" ? "You hit the wall!" : "You ate yourself!"}
    </p>
    <p className="text-lg mt-2 text-gray-700">Press Enter to reset the game.</p>
    <div className="mt-4">
      
      <img src="/snake.gif" alt="Snake GIF" className="mx-auto w-1/2" />
    </div>
  </div>
) : (
  <GamePieces score={score} setScore={setScore} onGameOver={handleGameOver} />
)}
      </div>
    </div>
  );
};

export default GameState;
