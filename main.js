// main.js

// ------------------------------------------------------------
// GAME CONFIGURATION
// ------------------------------------------------------------
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 600;
const SPEED       = 200; // px/sec

console.log(`⏳ Initializing Nobelisk MVP — Phaser v${Phaser.VERSION}`);

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    console.log('[MainScene] create() START');

    // — Background —
    this.cameras.main.setBackgroundColor('#000000');
    console.log('[MainScene] Background set to black');

    // — Buildings —
    console.log('[MainScene] Drawing buildings...');
    const buildG = this.add.graphics().setDepth(0).lineStyle(2, 0x000000, 1);
    buildG.fillStyle(0x8B4513, 1).fillRect(150, 280, 120, 60).strokeRect(150, 280, 120, 60);
    buildG.fillStyle(0xFFD700, 1).fillRect(560, 280, 120, 60).strokeRect(560, 280, 120, 60);
    buildG.fillStyle(0x888888, 1).fillRect(700, 100, 50, 80).strokeRect(700, 100, 50, 80);
    console.log('[MainScene] Buildings drawn');

    // — NPCs —
    console.log('[MainScene] Drawing NPCs...');
    this.npcs = [
      { name: 'Blacksmith', x: 200, y: 350 },
      { name: 'Stranger',   x: 400, y: 350 },
      { name: 'Innkeeper',  x: 600, y: 350 }
    ];
    const npcG = this.add.graphics().setDepth(1);
    this.npcs.forEach(npc => {
      npcG.fillStyle(0x888888, 1).fillRect(npc.x, npc.y, 20, 20);
      const headColor = { Blacksmith: 0xCCCCCC, Stranger: 0xFF00FF, Innkeeper: 0xFFFF00 }[npc.name];
      npcG.fillStyle(headColor, 1).fillCircle(npc.x + 10, npc.y - 10, 10);
      console.log(`[MainScene] NPC "${npc.name}" at (${npc.x},${npc.y})`);
    });

    // — Player —
    console.log('[MainScene] Creating player...');
    this.player = this.add.rectangle(100, 420, 32, 32, 0xffffff).setDepth(2);
    console.log(`[MainScene] Player at (${this.player.x},${this.player.y})`);

    // — Input —
    this.cursors = this.input.keyboard.createCursorKeys();
    console.log('[MainScene] Arrow keys mapped');

    // — Dialogue setup —
    this.dialogOptions = ['Buy', 'Workbench', 'Chat'];
    this.dialogActive  = false;

    // dialogue UI (hidden by default)
    this.dialogBox  = this.add.graphics().setDepth(10).setVisible(false);
    this.dialogText = this.add.text(0, 0, '', { font: '16px monospace', fill: '#ffffff' })
                           .setDepth(11).setVisible(false);

    this.optionTexts = this.dialogOptions.map(opt =>
      this.add.text(0, 0, opt, { font: '14px monospace', fill: '#ffffff' })
          .setDepth(11).setVisible(false)
    );

    console.log('[MainScene] Dialogue system initialized');
    console.log('[MainScene] create() END');
  }

  update(_time, delta) {
    // 1) Dialogue active? handle choice or cancel
    if (this.dialogActive) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
        console.log(`[Dialogue] Chosen: ${this.dialogOptions[0]}`);
        this.hideDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        console.log(`[Dialogue] Chosen: ${this.dialogOptions[1]}`);
        this.hideDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
        console.log(`[Dialogue] Chosen: ${this.dialogOptions[2]}`);
        this.hideDialogue();
      } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        console.log('[Dialogue] Cancelled with Down key');
        this.hideDialogue();
      }
      return; // skip movement while dialog is open
    }

    // 2) Movement (horizontal only)
    let moved = false;
    if (this.cursors.left.isDown) {
      this.player.x -= SPEED * (delta / 1000);
      moved = true;
    } else if (this.cursors.right.isDown) {
      this.player.x += SPEED * (delta / 1000);
      moved = true;
    }
    this.player.x = Phaser.Math.Clamp(this.player.x, 16, GAME_WIDTH - 16);
    if (moved) {
      console.log(`[MainScene] Player x=${this.player.x.toFixed(1)}`);
    }

    // 3) Up key to start dialogue if near NPC
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      const found = this.npcs.find(npc => Math.abs(this.player.x - npc.x) < 30);
      if (found) {
        this.startDialogue(found);
      }
    }
  }

  startDialogue(npc) {
    console.log(`[Dialogue] Starting with ${npc.name}`);
    this.dialogActive = true;
    this.showDialogue();
  }

  showDialogue() {
    // draw box
    this.dialogBox.clear()
      .fillStyle(0x000000, 0.8)
      .fillRect(50, GAME_HEIGHT - 150, GAME_WIDTH - 100, 120)
      .setVisible(true);

    // prompt text
    this.dialogText
      .setText('Choose action:')
      .setPosition(70, GAME_HEIGHT - 140)
      .setVisible(true);

    // options: left, up, right
    const positions = [
      { x: 100,               y: GAME_HEIGHT - 100 },
      { x: GAME_WIDTH / 2 - 30, y: GAME_HEIGHT - 100 },
      { x: GAME_WIDTH - 180,  y: GAME_HEIGHT - 100 }
    ];
    this.optionTexts.forEach((txt, i) => {
      txt.setPosition(positions[i].x, positions[i].y).setVisible(true);
    });
  }

  hideDialogue() {
    this.dialogBox.setVisible(false);
    this.dialogText.setVisible(false);
    this.optionTexts.forEach(txt => txt.setVisible(false));
    this.dialogActive = false;
    console.log('[Dialogue] Closed');
  }
}

// ------------------------------------------------------------
// GAME INIT
// ------------------------------------------------------------
console.log('[Game] Starting Phaser Game');
new Phaser.Game({
  type:   Phaser.AUTO,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  scene: [ MainScene ]
});
console.log('[Game] Phaser instantiated');
