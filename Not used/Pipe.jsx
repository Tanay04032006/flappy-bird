import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import PipesScene from "../game/PipesScene"; // Separate file for pipe logic

const Pipes = () => {
  const gameRef = useRef(null);
  const gameInstance = useRef(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scene: PipesScene, // The scene handling pipe logic
      parent: gameRef.current,
    };

    gameInstance.current = new Phaser.Game(config);

    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy(true);
        gameInstance.current = null;
      }
    };
  }, []);

  return <div ref={gameRef} className="game-container"></div>;
};

export default Pipes;
