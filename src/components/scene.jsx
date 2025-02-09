import { useEffect, useRef } from "react";
import Phaser from "phaser";
import FlappyBirdScene from "../game/Scene"; // Import the game scene

const SceneComponent = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: 288, // Match game resolution
        height: 512, // Match game resolution
        physics: {
          default: "arcade",
          arcade: { gravity: { y: 0 }, debug: false },
        },
        scene: [FlappyBirdScene],
        parent: "game-container", // Attach game to this div
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full">
      <div id="game-container" className="relative"></div>
    </div>
  );
};

export default SceneComponent;
