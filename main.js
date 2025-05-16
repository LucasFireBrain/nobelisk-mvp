// main.js
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 600;

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // nothing to load here
  }

  create() {
    // 1) Show version
    this.add.text(10, 10, 'Phaser v' + Phaser.VERSION, {
      font: '16px monospace',
      fill: '#000'
    });

    // 2) Draw static shapes
    const shapes = this.add.graphics();
    shapes.fillStyle(0xff0000, 1).fillCircle(200, 300, 20);               // Red circle
    shapes.fillStyle(0x00ff00, 1).fillTriangle(300, 350, 350, 250, 400, 350); // Green triangle
    shapes.fillStyle(0x0000ff, 1).fillRect(500, 300, 40, 40);            // Blue rectangle

    // 3) Create player as a white square
    this.player = this.add.rectangle(100, 300, 32, 32, 0xffffff);

    // 4) Input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    const speed = 200; // px/sec
    // move left/right
    if (this.cursors.left.isDown) {
      this.player.x -= speed * (delta / 1000);
    } else if (this.cursors.right.isDown) {
      this.player.x += speed * (delta / 1000);
    }
    // clamp within screen
    this.player.x = Phaser.Math.Clamp(this.player.x, 16, GAME_WIDTH - 16);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  scene: [ MainScene ]
});
