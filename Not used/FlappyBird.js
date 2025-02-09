import Phaser from "phaser";

export default class FlappyBird extends Phaser.Scene {
  constructor() {
    super("FlappyBirdScene");
  }

  preload() {
    this.load.image("bird", "/bird.png");
  }

  create() {
    this.bird = this.physics.add.sprite(200, 300, "bird").setOrigin(0.5);
    this.bird.setGravityY(800);

    this.input.on("pointerdown", this.flap, this);

    // Start Pipe Scene
    this.scene.launch("PipeScene");
    this.pipeScene = this.scene.get("PipeScene");

    // Wait for Pipe Scene to initialize pipes
    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.pipeScene.pipes) {
          console.log("✅ Collision enabled between bird and pipes");

          this.physics.add.collider(
            this.bird,
            this.pipeScene.pipes,
            this.handleCollision,
            null,
            this
          );
        } else {
          console.log("❌ Pipes group is not initialized!");
        }
      },
      loop: false,
    });

    // Score Tracking
    this.score = 0;
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: "24px",
      fill: "#fff",
    });
  }

  flap() {
    this.bird.setVelocityY(-300);
  }

  update() {
    if (this.bird.y > 600 || this.bird.y < 0) {
      this.handleCollision();
    }
    this.updateScore();
  }

  updateScore() {
    if (!this.pipeScene || !this.pipeScene.pipes) return;

    this.pipeScene.pipes.children.iterate((pipe) => {
      if (!pipe.scored && pipe.x < this.bird.x) {
        this.score += 1;
        pipe.scored = true;
        this.scoreText.setText(`Score: ${this.score}`);
      }
    });
  }

  handleCollision() {
    console.log("💀 Collision detected! Restarting...");
    this.scene.restart();
  }
}
