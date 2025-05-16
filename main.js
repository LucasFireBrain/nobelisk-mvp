// main.js

// ------------------------------------------------------------
// GAME CONFIGURATION
// ------------------------------------------------------------
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 600;

// ------------------------------------------------------------
// MAIN SCENE
// ------------------------------------------------------------
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    // Log scene start and Phaser version
    console.log(`[MainScene] create() start — Phaser v${Phaser.VERSION}`);

    // 1) Background
    this.cameras.main.setBackgroundColor('#87CEEB');
    console.log('[MainScene] Background set to sky-blue');

    // 2) BUILDINGS (draw behind NPCs)
    console.log('[MainScene] Drawing buildings...');
    const buildG = this.add.graphics();
    buildG.lineStyle(2, 0x000000, 1);

    // Blacksmith shop
    buildG
      .fillStyle(0x8B4513, 1)
      .fillRect(150, 280, 120, 60)
      .strokeRect(150, 280, 120, 60);

    // Inn
    buildG
      .fillStyle(0xFFD700, 1)
      .fillRect(560, 280, 120, 60)
      .strokeRect(560, 280, 120, 60);

    // Fast-Travel Terminal
    buildG
      .fillStyle(0x888888, 1)
      .fillRect(700, 100, 50, 80)
      .strokeRect(700, 100, 50, 80);

    console.log('[MainScene] Buildings drawn');

    // 3) NPCs (draw in front of buildings)
    console.log('[MainScene] Drawing NPCs...');
    const npcG = this.add.graphics();

    // Blacksmith NPC
    npcG
      .fillStyle(0x888888, 1)
      .fillRect(200, 350, 20, 20)
      .fillStyle(0xCCCCCC, 1)
      .fillCircle(210, 340, 10);

    // Hidden Stranger NPC
    npcG
      .fillStyle(0x888888, 1)
      .fillRect(400, 350, 20, 20)
      .fillStyle(0xFF00FF, 1)
      .fillCircle(410, 340, 10);

    // Innkeeper NPC
    npcG
      .fillStyle(0x888888, 1)
      .fillRect(600, 350, 20, 20)
      .fillStyle(0xFFFF00, 1)
      .fillCircle(610, 340, 10);

    console.log('[MainScene] NPCs drawn');

    // 4) PLAYER (on top layer, Y lowered to walk “in front”)
    console.log('[MainScene] Creating player...');
    this.player = this.add.rectangle(100, 420, 32, 32, 0xffffff);
    console.log(`[MainScene] Player created at x=${this.player.x}, y=${this.player.y}`);

    // 5) INPUT SETUP (horizontal only)
    this.cursors = this.input.keyboard.createCursorKeys();
    console.log('[MainScene] Cursor keys configured for horizontal movement');

    // 6) VERSION OVERLAY (logs only)
    console.log(`[MainScene] Ready — running Phaser v${Phaser.VERSION}`);
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

    // Log movement once per update if moved
    if (moved) {
      console.log(`[MainScene] Player moved to x=${this.player.x.toFixed(1)}`);
    }
  }
}

// ------------------------------------------------------------
// GAME INITIALIZATION
// ------------------------------------------------------------
console.log(`Starting Phaser game — v${Phaser.VERSION}`);
new Phaser.Game({
  type: Phaser.AUTO,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  scene: [ MainScene ]
});
