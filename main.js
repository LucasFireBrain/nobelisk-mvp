// main.js
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 600;

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // sky background
    this.cameras.main.setBackgroundColor('#87CEEB');

    // —— BUILDINGS (behind NPCs) ——
    const buildG = this.add.graphics();
    buildG.lineStyle(2, 0x000000, 1);

    // Blacksmith shop
    buildG.fillStyle(0x8B4513, 1)
          .fillRect(150, 280, 120, 60)
          .strokeRect(150, 280, 120, 60);

    // Inn
    buildG.fillStyle(0xFFD700, 1)
          .fillRect(560, 280, 120, 60)
          .strokeRect(560, 280, 120, 60);

    // Fast-Travel Terminal
    buildG.fillStyle(0x888888, 1)
          .fillRect(700, 100, 50, 80)
          .strokeRect(700, 100, 50, 80);

    // —— NPCs (in front of buildings) ——
    const npcG = this.add.graphics();

    // Blacksmith NPC
    npcG.fillStyle(0x888888, 1)
        .fillRect(200, 350, 20, 20)
        .fillStyle(0xCCCCCC, 1)
        .fillCircle(210, 340, 10);

    // Hidden Stranger NPC
    npcG.fillStyle(0x888888, 1)
        .fillRect(400, 350, 20, 20)
        .fillStyle(0xFF00FF, 1)
        .fillCircle(410, 340, 10);

    // Innkeeper NPC
    npcG.fillStyle(0x888888, 1)
        .fillRect(600, 350, 20, 20)
        .fillStyle(0xFFFF00, 1)
        .fillCircle(610, 340, 10);

    // —— PLAYER (on top layer, Y lowered to walk in front) ——
    this.player = this.add.rectangle(100, 420, 32, 32, 0xffffff);

    // —— INPUT (horizontal only) ——
    this.cursors = this.input.keyboard.createCursorKeys();

    // —— VERSION TEXT (always on top) ——
    this.add
      .text(10, 10, 'Phaser v' + Phaser.VERSION, {
        font: '16px monospace',
        fill: '#000'
      })
      .setDepth(1000);
  }

  update(_, delta) {
    const speed = 200;
    if (this.cursors.left.isDown) {
      this.player.x -= speed * (delta / 1000);
    } else if (this.cursors.right.isDown) {
      this.player.x += speed * (delta / 1000);
    }
    // constrain to screen
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
