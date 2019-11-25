import PlayerCard from "./PlayerCard";
import EnemyCard from "./EnemyCard";
import HealCard from "./HealCard";
import ItemCard from "./ItemCard";
import InvSlot from "./InvSlot";
import PowerButton from "./PowerButton";

export function initPreload(scene) {
  scene.load.svg("enemycardsprite", "assets/enemycard.svg", {
    width: scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("healcardsprite", "assets/healcard.svg", {
    width: scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("itemcardsprite", "assets/itemcard.svg", {
    width: scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("playercardsprite", "assets/playercard.svg", {
    width: scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("bosscardsprite", "assets/bosscard.svg", {
    width: scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("cardbacksprite", "assets/cardback.svg", {
    width: scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("invslotsprite", "assets/invslot.svg", {
    scale: 0.75
  });
  scene.load.svg("invslotcardsprite", "assets/invslot-card.svg", {
    scale: 0.75
  });
  scene.load.svg("power-button", "assets/power-button.svg", {
    scale: 0.25
  });
  scene.load.svg("item-atk", "assets/item-atk.svg", {
    scale: 0.15
  });
  scene.load.svg("item-def", "assets/item-def.svg", {
    scale: 0.15
  });
  scene.load.image("red-particle", "assets/red-particle.png");
  scene.load.svg("shuriken-particle", "assets/shuriken-particle.svg", {
    scale: 0.4
  });

  // CHARSPRITE PRELOAD
  scene.load.svg("photocop", "assets/charsprite/char_photocop.svg", {
    width: 0.6 * scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("stagiaire", "assets/charsprite/char_stagiaire.svg", {
    width: 0.6 * scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("turboninja", "assets/charsprite/char_turboninja.svg", {
    width: 0.6 * scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("chips", "assets/charsprite/char_chips.svg", {
    width: 0.6 * scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("katanul", "assets/charsprite/char_katanul.svg", {
    width: 0.6 * scene.cardWidth,
    height: scene.cardHeight
  });
  scene.load.svg("shuriken", "assets/charsprite/char_shuriken.svg", {
    width: 0.6 * scene.cardWidth,
    height: scene.cardHeight
  });
}

export function initVars(scene) {
  scene.cameraWidth = 0;
  scene.cameraHeight = 0;
  scene.cardPadding = 20;
  scene.cardWidth = 100;
  scene.cardHeight = 142;
  scene.cardArr = [];
  scene.playerStarterIndex = 4;
  scene.player = null;
  scene.nRow = 3;
  scene.nCol = 3;
  scene.seed = "";
  scene.curCardIndex = 0;
  scene.score = 0;
  scene.gameOffsetX = 0;
  scene.gameOffsetY = 0;
  scene.pool = 1;
  scene.itemDisplay = [];
  scene.playersTurn = true;
  scene.nTour = 0;
  scene.itemSelected = "";
  scene.powerSelected = false;

  scene.explodingParticles = null;
  scene.explodingBossParticles = null;
  scene.slashingParticles = null;

  scene.powerButtonDisplay = null;
  scene.scoreDisplay = null;
  scene.roundDisplay = null;
}

export function initCardArray(scene, cardArr, col, row, offX, offY) {
  console.log("----GENERATING-NEW-LEVEL----");
  scene.seed = scene.generateSeed();
  console.log("THE SEED IS : " + scene.seed);

  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      if (scene.seed[scene.curCardIndex] === "p") {
        cardArr.push(
          (scene.player = new PlayerCard(
            scene,
            offX + scene.cardPadding * (x + 1) + scene.cardWidth * x,
            offY + scene.cardPadding * (y + 1) + scene.cardHeight * y,
            scene.curCardIndex,
            2,
            12,
            "Player"
          ))
        );
      } else if (scene.seed[scene.curCardIndex] === "h") {
        cardArr.push(
          new HealCard(
            scene,
            offX + scene.cardPadding * (x + 1) + scene.cardWidth * x,
            offY + scene.cardPadding * (y + 1) + scene.cardHeight * y,
            scene.curCardIndex,
            5,
            "Ramen"
          )
        );
      } else if (scene.seed[scene.curCardIndex] === "i") {
        cardArr.push(
          new ItemCard(
            scene,
            offX + scene.cardPadding * (x + 1) + scene.cardWidth * x,
            offY + scene.cardPadding * (y + 1) + scene.cardHeight * y,
            scene.curCardIndex
          )
        );
      } else {
        cardArr.push(
          new EnemyCard(
            scene,
            offX + scene.cardPadding * (x + 1) + scene.cardWidth * x,
            offY + scene.cardPadding * (y + 1) + scene.cardHeight * y,
            scene.curCardIndex
          )
        );
      }
      scene.curCardIndex++;
    }
  }

  this.showRoundScreen(scene);
  scene.updatePlayerInSightIndexes();
  scene.flipCardsRoutine();
}

export function initItemDisplay(scene) {
  for (let i = 0; i < scene.player.maxInvSlots; i++) {
    scene.itemDisplay.push(
      new InvSlot(
        scene,
        scene.gameWidth / 2 - 100 + i * 100,
        scene.gameHeight - 40,
        i
      )
    );
  }
}

export function initHudDisplay(scene) {
  scene.scoreDisplay = scene.add.text(
    scene.gameOffsetX - 25,
    50,
    "SCORE : " + scene.score + " || TOUR N° " + scene.nTour,
    {
      font: "14px Courier",
      fill: "#AAA"
    }
  );
  scene.powerButtonDisplay = new PowerButton(
    scene,
    scene.gameWidth - scene.gameOffsetX - 35,
    45,
    "power-button",
    "LE ZBEUL"
  );
}

export function initRoundDisplay(scene) {
  scene.roundDisplay = scene.add.text(
    0,
    scene.gameHeight / 2 - 50,
    "Round " + scene.pool,
    {
      font: "65px roadrage",
      fill: "#d01208"
    }
  );
  scene.roundDisplay.x = -scene.roundDisplay.width;
  scene.roundDisplay.angle = -7;
  scene.roundDisplay.setDepth(5);
}

export function initParticles(scene) {
  scene.explodingParticles = scene.add
    .particles("red-particle")
    .setDepth(5)
    .createEmitter({
      angle: { min: 0, max: 360 },
      speed: 100,
      lifespan: 250,
      scale: { start: 0.3, end: 0.0 },
      blendMode: "NORMAL",
      quantity: 50,
      on: false
    });
  scene.explodingBossParticles = scene.add
    .particles("red-particle")
    .setDepth(5)
    .createEmitter({
      angle: { min: 0, max: 360 },
      speed: 100,
      lifespan: 1550,
      scale: { start: 0.5, end: 0.0 },
      blendMode: "NORMAL",
      quantity: 100,
      on: false
    });
  scene.slashingParticles = scene.add.particles("red-particle").setDepth(5);
  scene.slashingParticles = scene.slashingParticles.createEmitter({
    angle: { min: 0, max: 100 },
    speed: 100,
    lifespan: 250,
    scale: { start: 0.3, end: 0.0 },
    blendMode: "NORMAL",
    quantity: 20,
    on: false
  });
}

export function destroyCardArray(scene, cardArr) {
  scene.updateHud(0);
  scene.nTour = 0;
  for (let i = 0; i < cardArr.length; i++) {
    cardArr[i].destroy();
  }
  cardArr = [];
  scene.cardArr = cardArr;
  scene.player = null;
  scene.curCardIndex = 0;
  scene.score = 0;
}

export function destroyItemDisplay(scene) {
  for (let i = 0; i < scene.player.maxInvSlots; i++) {
    scene.itemDisplay[i].holdedCard = null;
    scene.itemDisplay[i].destroy();
  }
  scene.itemDisplay = [];
}

export function showRoundScreen(scene) {
  scene.roundDisplay.setText("Round " + scene.pool);
  // let col = Phaser.Display.Color.Interpolate.RGBWithRGB(
  //   25,
  //   25,
  //   25,
  //   200,
  //   200,
  //   200,
  //   100,
  //   1
  // );
  var timeline = scene.tweens.createTimeline();

  timeline.add({
    targets: scene.roundDisplay,
    x: scene.gameWidth / 2 - scene.roundDisplay.width / 2,
    ease: "Power2",
    duration: 1000,
    onUpdate: function() {}
  });
  timeline.add({
    targets: scene.roundDisplay,
    x: scene.gameWidth / 2 - scene.roundDisplay.width / 2,
    ease: "Power2",
    duration: 1000
  });
  timeline.add({
    targets: scene.roundDisplay,
    x: scene.gameWidth,
    ease: "Power1",
    duration: 1000
  });
  timeline.play();
}
