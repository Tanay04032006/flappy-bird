import Phaser from "phaser";

export default class FlappyBirdScene extends Phaser.Scene {
  constructor() {
    super("FlappyBirdScene");
  }

  preload() {
    this.load.image("bgDay", "/background-day.png");
    this.load.image("bgNight", "/background-night.png");
    this.load.image("foreground", "/foreground.png");
    this.load.image("bird", "/bird.png");
    this.load.image("pipeTop", "/pipe-top.png");
    this.load.image("pipeBottom", "/pipe-bottom.png");
  }

  create() {
    // Background setup (centered)
    this.bgDay = this.add.image(144, 256, "bgDay").setOrigin(0.5);
    this.bgNight = this.add.image(144, 256, "bgNight").setOrigin(0.5).setVisible(false);
    this.isDay = true;

    // Foreground (ground) setup at bottom
    this.foreground = this.add.tileSprite(144, 486, 288, 26, "foreground");

    // Toggle Day/Night every 10 seconds
    this.time.addEvent({
      delay: 10000,
      callback: this.toggleDayNight,
      callbackScope: this,
      loop: true,
    });

    // Bird setup (placed centrally)
    this.bird = this.physics.add.sprite(60, 256, "bird").setOrigin(0.5);
    this.bird.setGravityY(600);

    this.input.on("pointerdown", this.flap, this);

    // Pipe group
    this.pipes = this.physics.add.group({ immovable: true });

    // Generate pipes
    this.time.addEvent({
      delay: 1600,
      callback: this.addPipes,
      callbackScope: this,
      loop: true,
    });

    // Collision detection
    this.physics.add.collider(this.bird, this.pipes, this.handleCollision, null, this);

    // Score tracking
    this.score = 0;
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: "16px",
      fill: "#fff",
    });
  }

  flap() {
    this.bird.setVelocityY(-250);
  }

  addPipes() {
    const pipeX = 300;
    const pipeGap = 150;
    const minY = 150;
    const maxY = 350;
    const pipeY = Phaser.Math.Between(minY, maxY);

    // Top Pipe
    const topPipe = this.pipes.create(pipeX, pipeY - pipeGap / 2, "pipeTop");
    topPipe.setOrigin(0.5, 1);
    topPipe.setVelocityX(-100);
    topPipe.body.allowGravity = false;
    topPipe.body.setImmovable(true);
    topPipe.scored = false;

    // Bottom Pipe
    const bottomPipe = this.pipes.create(pipeX, pipeY + pipeGap / 2, "pipeBottom");
    bottomPipe.setOrigin(0.5, 0);
    bottomPipe.setVelocityX(-100);
    bottomPipe.body.allowGravity = false;
    bottomPipe.body.setImmovable(true);
    bottomPipe.scored = false;
  }

  update() {
    if (this.bird.y > 486 || this.bird.y < 0) {
      this.handleCollision();
    }
    this.updateScore();

    // Scroll foreground to match pipes' speed
    this.foreground.tilePositionX += 1;

    // Remove pipes that move off-screen
    this.pipes.children.iterate((pipe) => {
      if (pipe && pipe.x < -50) {
        pipe.destroy();
      }
    });
  }

  updateScore() {
    this.pipes.children.iterate((pipe) => {
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

  toggleDayNight() {
    this.isDay = !this.isDay;
    this.bgDay.setVisible(this.isDay);
    this.bgNight.setVisible(!this.isDay);
  }
}
