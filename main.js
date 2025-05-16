// main.js
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 600;

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Show Phaser version
    this.add.text(10, 10, 'Phaser v' + Phaser.VERSION, {
      font: '16px monospace',
      fill: '#000'
    });

    // 1) Draw “houses” behind
    const shapes = this.add.graphics();
    shapes.fillStyle(0x666666, 1).fillRect(500, 280, 60, 80); // grey house

    // 2) Draw “townsfolk” in front of houses
    shapes.fillStyle(0xff0000, 1).fillCircle(200, 350, 20);               // red person
    shapes.fillStyle(0x00ff00, 1).fillTriangle(300, 370, 330, 320, 360, 370); // green person

    // 3) Create player **after** shapes, so it’s on top
    //    and drop Y so it walks “in front” of them
    this.player = this.add.rectangle(100, 420, 32, 32, 0xffffff);

    // 4) Only horizontal input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(_, delta) {
    const speed = 200;
    if (this.cursors.left.isDown) {
      this.player.x -= speed * (delta / 1000);
    } else if (this.cursors.right.isDown) {
      this.player.x += speed * (delta / 1000);
    }
    // clamp X to screen bounds
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
