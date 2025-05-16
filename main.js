// main.js

// ------------------------------------------------------------
// GAME CONFIGURATION
// ------------------------------------------------------------
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 600;

// Log initialization
console.log(`⏳ Initializing Nobelisk MVP — Phaser v${Phaser.VERSION}`);

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    console.log('[MainScene] create() START');

    // 1) Background
    this.cameras.main.setBackgroundColor('#000000');
    console.log('[MainScene] Background set to black');

    // 2) BUILDINGS (draw behind NPCs)
    console.log('[MainScene] Drawing buildings...');
    const buildG = this.add.graphics();
    buildG.lineStyle(2, 0x000000, 1);

    // Blacksmith shop
    buildG
      .fillStyle(0x8B4513, 1)
      .fillRect(150, 280, 120, 60)
      .strokeRect(150, 280, 120, 60);
    console.log('[MainScene] - Blacksmith drawn at (150,280)');

    // Inn
    buildG
      .fillStyle(0xFFD700, 1)
      .fillRect(560, 280, 120, 60)
      .strokeRect(560, 280, 120, 60);
    console.log('[MainScene] - Inn drawn at (560,280)');

    // Fast-Travel Terminal
    buildG
      .fillStyle(0x888888, 1)
      .fillRect(700, 100, 50, 80)
      .strokeRect(700, 100, 50, 80);
    console.log('[MainScene] - Terminal drawn at (700,100)');

    // 3) NPCs (in front of buildings)
    console.log('[MainScene] Drawing NPCs...');
    const npcG = this.add.graphics();

    // Blacksmith NPC
    npcG
      .fillStyle(0x888888, 1)
      .fillRect(200, 350, 20, 20)
      .fillStyle(0xCCCCCC, 1)
      .fillCircle(210, 340, 10);
    console.log('[MainScene] - Blacksmith NPC at (200,350)');

    // Hidden Stranger NPC
    npcG
      .fillStyle(0x888888, 1)
      .fillRect(400, 350, 20, 20)
      .fillStyle(0xFF00FF, 1)
      .fillCircle(410, 340, 10);
    console.log('[MainScene] - Hidden Stranger NPC at (400,350)');

    // Innkeeper NPC
    npcG
      .fillStyle(0x888888, 1)
      .fillRect(600, 350, 20, 20)
      .fillStyle(0xFFFF00, 1)
      .fillCircle(610, 340, 10);
    console.log('[MainScene] - Innkeeper NPC at (600,350)');

    // 4) PLAYER (on top layer, Y lowered to walk in front)
    console.log('[MainScene] Creating player...');
    this.player = this.add.rectangle(100, 420, 32, 32, 0xffffff);
    console.log(`[MainScene] Player created at (${this.player.x},${this.player.y})`);

    // 5) INPUT SETUP (horizontal only)
    this.cursors = this.input.keyboard.createCursorKeys();
    console.log('[MainScene] Cursor keys configured');

    console.log('[MainScene] create() END');
  }

  update(_time, delta) {
    // Called every frame
    const speed = 200;
    let moved = false;

    if (this.cursors.left.isDown) {
      this.player.x -= speed * (delta / 1000);
      moved = true;
    } else if (this.cursors.right.isDown) {
      this.player.x += speed * (delta / 1000);
      moved = true;
    }

    // Clamp within screen bounds
    this.player.x = Phaser.Math.Clamp(this.player.x, 16, GAME_WIDTH - 16);

    // Log movement once per frame if moved
    if (moved) {
      console.log(`[MainScene] Player moved to x=${this.player.x.toFixed(1)}`);
    }
  }
}

// ------------------------------------------------------------
// GAME INITIALIZATION
// ------------------------------------------------------------
console.log('[Game] Starting Phaser Game');
new Phaser.Game({
  type: Phaser.AUTO,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  scene: [ MainScene ]
});
console.log('[Game] Phaser Game instantiated');
