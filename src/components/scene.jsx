import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import FlappyBirdScene from "../game/Scene";

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(name + "="));
  return cookie ? parseInt(cookie.split("=")[1]) : 0;
};

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const SceneComponent = () => {
  const gameRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(getCookie("maxScore"));

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);

    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: 288,
        height: 512,
        physics: {
          default: "arcade",
          arcade: { gravity: { y: 0 }, debug: false },
        },
        scene: [FlappyBirdScene],
        parent: "game-container",
      };

      gameRef.current = new Phaser.Game(config);
      gameRef.current.scene.start("FlappyBirdScene", { setGameOver, setScore });
    } else {
      gameRef.current.scene.stop("FlappyBirdScene");
      gameRef.current.scene.start("FlappyBirdScene", { setGameOver, setScore });
    }
  };

  useEffect(() => {
    if (score > maxScore) {
      setMaxScore(score);
      setCookie("maxScore", score, 365);
    }
  }, [score]);

  const resetMaxScore = () => {
    document.cookie = "maxScore=0;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    setMaxScore(0);
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center w-full h-screen border-2 border-black"
      style={{
        backgroundImage: "url('/background-day.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Score Display */}
      {gameStarted && !gameOver && (
        <div className="absolute top-10 flex flex-col items-center bg-black/60 px-6 py-3 rounded-lg shadow-lg">
          {/* Max Score */}
          <div className="text-yellow-400 font-extrabold text-3xl">
            Max Score: {maxScore}
          </div>

          {/* Current Score */}
          <div className="mt-2 text-white font-bold text-2xl">
            Score: {score}
          </div>
        </div>
      )}

      {/* Foreground (Ground) */}
      <div
        className="absolute bottom-0 w-full h-20"
        style={{
          backgroundImage: "url('/foreground.png')",
          backgroundSize: "cover",
        }}
      ></div>

      {/* Game Container */}
      <div id="game-container" className="relative border-2"></div>

      {/* Start Button */}
      {!gameStarted && (
        <button onClick={startGame} className="absolute z-10">
          <img
            src="/start-button.png"
            alt="Start Game"
            className="w-32 cursor-pointer"
          />
        </button>
      )}

      {/* Restart Button */}
      {gameOver && (
        <button
          onClick={startGame}
          className="absolute z-10 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Restart
        </button>
      )}

      {/* Reset Max Score Button */}
      <button
        onClick={resetMaxScore}
        className=" my-10 absolute bottom-20 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 
             text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        🔄 Reset Max Score
      </button>
    </div>
  );
};

export default SceneComponent;
