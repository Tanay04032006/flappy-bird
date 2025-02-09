import Phaser from "phaser";

export default class PipeScene extends Phaser.Scene {
  constructor() {
    super({ key: "PipeScene" });
    this.score = 0;
  }

  preload() {
    this.load.image("pipeTop", "/pipe-top.png");
    this.load.image("pipeBottom", "/pipe-bottom.png");
  }

  create() {
    // Ensure pipes have physics bodies
    this.pipes = this.physics.add.group({
      immovable: true,
    });
    console.log("✅ Pipes group initialized");

    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.addPipes,
      callbackScope: this,
      loop: true,
    });
  }

  addPipes() {
    const pipeX = 800;
    const pipeGap = 150;
    const pipeY = Phaser.Math.Between(250, 450);

    // Top Pipe
    const topPipe = this.pipes.create(pipeX, pipeY - pipeGap / 2, "pipeTop");
    topPipe.setOrigin(0.5, 1);
    topPipe.setVelocityX(-200);
    topPipe.body.allowGravity = false;
    topPipe.body.setImmovable(true);
    topPipe.displayHeight = pipeY - pipeGap / 2;
    topPipe.scored = false;

    // Bottom Pipe
    const bottomPipe = this.pipes.create(pipeX, pipeY + pipeGap / 2, "pipeBottom");
    bottomPipe.setOrigin(0.5, 0);
    bottomPipe.setVelocityX(-200);
    bottomPipe.body.allowGravity = false;
    bottomPipe.body.setImmovable(true);
    bottomPipe.displayHeight = 600 - (pipeY + pipeGap / 2);
    bottomPipe.scored = false;
  }

  update() {
    this.pipes.children.iterate((pipe) => {
      if (pipe && pipe.x < -50) {
        pipe.destroy();
      }
    });
  }
}
