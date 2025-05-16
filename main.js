// ------------------------------------------------------------
// CONFIG & GLOBAL STATE
// ------------------------------------------------------------
const GAME_WIDTH  = 800;
const GAME_HEIGHT = 600;

let notebookData = {
  roughEssence: { He: 0, C: 0 /*…*/ },
  pureEssence: 0,
  consumables: {},
  questItems: {}
};

let playerState = {
  maxDurability: 100,
  curDurability: 100,
  boundTown: null,
  beltSlots: 1,
  beltItems: []
};

// ------------------------------------------------------------
// SHAPE-LIBRARY PLACEHOLDERS
// ------------------------------------------------------------
function createHeliumSprite(scene, x, y) {
  const g = scene.add.graphics();
  // torso
  g.fillStyle(0xADD8E6, 1).fillRect(x, y + 16, 16, 16);
  // head
  g.fillStyle(0xFFFFFF, 1).fillCircle(x + 8, y, 8);
  // eyes
  g.fillStyle(0x000000, 1)
   .fillCircle(x + 5, y - 2, 1)
   .fillCircle(x + 11, y - 2, 1);
  return g;
}

function createNPC(scene, x, y, headColor = 0xFF0000) {
  const g = scene.add.graphics();
  // body
  g.fillStyle(0x888888, 1).fillRect(x, y + 12, 20, 20);
  // head
  g.fillStyle(headColor, 1).fillCircle(x + 10, y + 4, 10);
  // eyes
  g.fillStyle(0x000000, 1)
   .fillCircle(x + 6, y + 2, 1)
   .fillCircle(x + 14, y + 2, 1);
  return g;
}

function createBuilding(scene, x, y, width, height) {
  const g = scene.add.graphics();
  g.lineStyle(2, 0x000000, 1)
   .strokeRect(x, y, width, height)
   .fillStyle(0x555555, 1)
   .fillRect(x, y, width, height);
  return g;
}

function createTree(scene, x, y) {
  const g = scene.add.graphics();
  // trunk
  g.fillStyle(0x8B4513, 1).fillRect(x + 12, y + 24, 8, 16);
  // foliage
  g.fillStyle(0x228B22, 1).fillTriangle(x, y + 24, x + 32, y + 24, x + 16, y);
  return g;
}

function createEnemy(scene, x, y, elementColor = 0x333333) {
  const g = scene.add.graphics();
  g.fillStyle(elementColor, 1).fillCircle(x + 8, y + 8, 16);
  return g;
}

// ------------------------------------------------------------
// BASE SCENE CLASS
// ------------------------------------------------------------
class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  preload() {
    // TODO: load assets here
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB');
    this.player = this.physics.add.sprite(100, 300);
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyI = this.input.keyboard.addKey('I');

    this.keyI.on('down', () => {
      console.log('Open Notebook UI', notebookData);
      // TODO: show notebook overlay
    });

    this.player.body.setSize(16, 32);
    this.player.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', body => {
      if (body.gameObject === this.player) {
        if (this.player.x <= 0 && this.prevScene) {
          this.scene.start(this.prevScene);
        }
        if (this.player.x >= GAME_WIDTH && this.nextScene) {
          this.scene.start(this.nextScene);
        }
      }
    });
  }

  update() {
    const spd = 150;
    this.player.setVelocity(0);
    if (this.cursors.left.isDown)  this.player.setVelocityX(-spd);
    if (this.cursors.right.isDown) this.player.setVelocityX(spd);
    if (this.cursors.up.isDown)    this.player.setVelocityY(-spd);
    if (this.cursors.down.isDown)  this.player.setVelocityY(spd);
  }
}

// ------------------------------------------------------------
// SCENES
// ------------------------------------------------------------
class TownA extends BaseScene {
  constructor() { super('TownA'); }
  create() {
    super.create();
    this.prevScene = null;
    this.nextScene = 'Forest1';
    createNPC(this, 200, 300, 0xAAAAAA); // Blacksmith
    createNPC(this, 400, 300, 0xFF00FF); // HiddenStranger
    createNPC(this, 600, 300, 0xFFFF00); // Innkeeper
    createBuilding(this, 700, 100, 50, 80); // Terminal
    // TODO: overlap callbacks
  }
}

class Forest1 extends BaseScene {
  constructor() { super('Forest1'); }
  create() {
    super.create();
    this.prevScene = 'TownA';
    this.nextScene = 'TownB';
    createTree(this, 100, 200);
    createTree(this, 200, 250);
    this.combatZone = new Phaser.Geom.Rectangle(300, 200, 200, 200);
    this.inCombat = false;
  }

  update(time, delta) {
    super.update();
    if (!this.inCombat && this.combatZone.contains(this.player.x, this.player.y)) {
      this.startCombat();
    }
  }

  startCombat() {
    this.inCombat = true;
    // TODO: spawn waves
  }
}

class TownB extends BaseScene {
  constructor() { super('TownB'); }
  create() {
    super.create();
    this.prevScene = 'Forest1';
    this.nextScene = 'Forest2';
    // TODO: mirror TownA
  }
}

class Forest2 extends BaseScene {
  constructor() { super('Forest2'); }
  create() {
    super.create();
    this.prevScene = 'TownB';
    this.nextScene = null;
    // TODO: mirror Forest1
  }
}

// ------------------------------------------------------------
// GAME INIT
// ------------------------------------------------------------
const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [TownA, Forest1, TownB, Forest2]
};

new Phaser.Game(config);

// ------------------------------------------------------------
// NEXT MODULES TO TACKLE (TODO)
// ------------------------------------------------------------
// - NPC interactions (quiz, repair, respawn, fast-travel)
// - Combat attacks & knockback
// - spawnDrop & collect logic
// - Notebook “Purify” context-menu
// - Durability, death/respawn, essence economy
// - Quick-use belt & healingPotion
