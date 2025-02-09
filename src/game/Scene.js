import Phaser from "phaser";

export default class FlappyBirdScene extends Phaser.Scene {
  constructor() {
    super("FlappyBirdScene");
  }

  init(data) {
    this.setGameOver = data.setGameOver || (() => {});
    this.setScore = data.setScore || (() => {});
  }

  preload() {
    this.load.image("bgDay", "/background-day.png");
    this.load.image("bgNight", "/background-night.png");
    this.load.image("foreground", "/foreground.png");
    this.load.image("bird", "/bird.png");
    this.load.image("pipeTop", "/pipe-top.png");
    this.load.image("pipeBottom", "/pipe-bottom.png");

    this.load.audio("hit", "/hit.mp3");
    this.load.audio("point", "/point.mp3");
    this.load.audio("wing", "/wing.mp3");
  }

  create() {
    this.bgDay = this.add.image(144, 256, "bgDay").setOrigin(0.5);
    this.bgNight = this.add.image(144, 256, "bgNight").setOrigin(0.5).setVisible(false);
    this.isDay = true;

    this.foreground = this.add.tileSprite(144, 486, 288, 26, "foreground");

    this.time.addEvent({
      delay: 10000,
      callback: this.toggleDayNight,
      callbackScope: this,
      loop: true,
    });

    this.bird = this.physics.add.sprite(60, 256, "bird").setOrigin(0.5);
    this.bird.setGravityY(600);

    this.input.on("pointerdown", this.flap, this);

    this.pipes = this.physics.add.group({ immovable: true });

    this.time.addEvent({
      delay: 1600,
      callback: this.addPipes,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(this.bird, this.pipes, this.handleCollision, null, this);

    // Initialize Score
    this.score = 0;
    this.setScore(0); // Reset score in React component
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: "16px",
      fill: "#fff",
    });

    this.hitSound = this.sound.add("hit");
    this.pointSound = this.sound.add("point");
    this.wingSound = this.sound.add("wing");
  }

  flap() {
    this.bird.setVelocityY(-250);
    this.wingSound.play();
  }

  addPipes() {
    const pipeX = 300;
    const pipeGap = 150;
    const minY = 150;
    const maxY = 350;
    const pipeY = Phaser.Math.Between(minY, maxY);

    const topPipe = this.pipes.create(pipeX, pipeY - pipeGap / 2, "pipeTop");
    topPipe.setOrigin(0.5, 1);
    topPipe.setVelocityX(-100);
    topPipe.body.allowGravity = false;
    topPipe.body.setImmovable(true);
    topPipe.scored = false;

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

    this.foreground.tilePositionX += 1;

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
        this.setScore(this.score); // Sync score with React state
        this.pointSound.play();
      }
    });
  }

  handleCollision() {
    this.hitSound.play();
    this.setScore(this.score); // Store final score
    this.setGameOver(true); // Trigger game-over state in React
    this.scene.pause();
  }

  toggleDayNight() {
    this.isDay = !this.isDay;
    this.bgDay.setVisible(this.isDay);
    this.bgNight.setVisible(!this.isDay);
  }
}
