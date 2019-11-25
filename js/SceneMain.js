import Phaser from "phaser";

import * as GameFunc from "./GameFunc";
import EnemyCard from "./EnemyCard";
import HealCard from "./HealCard";
import ItemCard from "./ItemCard";

export default class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });

    this.debug = false;

    // Variables & constants initialisation
    GameFunc.initVars(this);
  }

  preload() {
    GameFunc.initPreload(this);
  }

  create() {
    // Get actual game dimension when game is launched
    this.gameWidth = this.cameras.main.width;
    this.gameHeight = this.cameras.main.height;

    // Get the offset to center board
    this.gameOffsetX =
      (this.gameWidth -
        this.nCol * (this.cardWidth + this.cardPadding) -
        this.cardPadding) /
        2 +
      this.cardWidth / 2;
    this.gameOffsetY =
      (this.gameHeight -
        this.nRow * (this.cardHeight + this.cardPadding) -
        this.cardPadding) /
        2 +
      this.cardHeight / 2;

    GameFunc.initRoundDisplay(this);

    GameFunc.initCardArray(
      this,
      this.cardArr,
      this.nCol,
      this.nRow,
      this.gameOffsetX,
      this.gameOffsetY
    );

    GameFunc.initHudDisplay(this);

    GameFunc.initItemDisplay(this);

    GameFunc.initParticles(this);

    // console.log(this.itemDisplay[0].sprite.displayWidth);

    // this.input.on("pointerup", function(pointer) {
    //   var touchX = pointer.x;
    //   var touchY = pointer.y;
    //   console.log(" X : " + touchX);
    // });

    this.getItem(null, null, null, 0);
  }

  restartLevel() {
    console.log("----RESTART-LEVEL-----");
    this.pool = 1;
    GameFunc.initCardArray(
      this,
      this.cardArr,
      this.nCol,
      this.nRow,
      this.gameOffsetX,
      this.gameOffsetY
    );
    GameFunc.initItemDisplay(this);
  }

  update() {}

  generateSeed() {
    let s = [];
    // TODO : BETTER RANDOM DISPOSITION
    for (let i = 0; i < 127; i++) {
      let r = Math.random();
      if (i === this.playerStarterIndex) {
        s[i] = "p";
      } else if (i > 0 && i % (this.nCol * this.nRow + 6) === 0) {
        s[i] = "b";
      } else {
        if (r < 0.2) {
          s[i] = "i";
        } else if (r < 0.3) {
          s[i] = "h";
        } else {
          s[i] = "e";
        }
      }
    }
    return s;
  }

  getColNumberOfCard(cardindex) {
    return cardindex % this.nCol;
  }
  getRowNumberOfCard(cardindex) {
    return Phaser.Math.FloorTo(cardindex / this.nCol);
  }
  getXfromIndex(cardindex) {
    let col = this.getColNumberOfCard(cardindex);
    return (
      this.gameOffsetX + this.cardPadding * (col + 1) + this.cardWidth * col
    );
  }
  getYfromIndex(cardindex) {
    let row = this.getRowNumberOfCard(cardindex);
    return (
      this.gameOffsetY + this.cardPadding * (row + 1) + this.cardHeight * row
    );
  }

  onCardPointerUpHandler(cardindex, pointer = null) {
    // on cliking cards event
    let ci = this.cardArr[cardindex];
    if (this.playersTurn) {
      if (ci.isInSight) {
        if (ci.constructor.name === "EnemyCard") {
          this.attackCardAnim(this.player.index, cardindex, this.shakeCardAnim);
        } else {
          this.shakeCardAnim(
            null,
            null,
            cardindex,
            this.movePlayerToCardAndDestroy
          );
        }
        // TURN COUNT ++
        this.nTour++;
      }
    } else {
      if (ci.isInSight && this.itemSelected !== "") {
        if (
          this.itemDisplay[this.itemSelected].holdedCard.type === 11 ||
          this.itemDisplay[this.itemSelected].holdedCard.type === 13
        ) {
          // TURN COUNT ++
          this.nTour++;
          this.itemKatanul(cardindex);
        }
      }

      if (this.powerSelected) {
        // TURN COUNT ++
        this.nTour++;
        this.powerAtk(cardindex);
      }
    }
  }

  movePlayerToCardAndDestroy(tween, targets, cardindex, noDamage = false) {
    // function is sent after shakeCardAnim anim complete
    let ci = this.cardArr[cardindex];

    // fire particles, bigger if boss
    if (ci.isBoss) {
      this.explodingBossParticles.setEmitZone({
        source: new Phaser.Geom.Rectangle(
          ci.x - this.cardWidth / 2,
          ci.y - this.cardHeight / 2,
          this.cardWidth,
          this.cardHeight
        ),
        type: "edge",
        quantity: 50
      });
      this.explodingBossParticles.explode();
      // Raise pool, show next round
      this.pool++;
      GameFunc.showRoundScreen(this);
    } else {
      this.explodingParticles.setEmitZone({
        source: new Phaser.Geom.Rectangle(
          ci.x - this.cardWidth / 2,
          ci.y - this.cardHeight / 2,
          this.cardWidth,
          this.cardHeight
        ),
        type: "edge",
        quantity: 50
      });
      this.explodingParticles.explode();
    }

    // detect card type & do stuff for each
    if (ci.constructor.name === "HealCard") {
      this.healPlayer(cardindex);
    } else if (ci.constructor.name === "ItemCard") {
      this.getItem(tween, targets, ci);
    } else {
      if (!noDamage) this.damagePlayer(cardindex);
    }

    // PLAYER DEATH CONDITION
    if (this.player.def <= 0) {
      console.log("---PLAYER-IS-DEAD---");
      GameFunc.destroyItemDisplay(this);
      GameFunc.destroyCardArray(this, this.cardArr);
      this.restartLevel();
    } else {
      // IF NOT DEAD
      // MOVE PLAYER CARD, CHANGE COORD AND INDEX
      this.moveCard(this.player.index, ci.index);

      let oldplayerindex = this.player.index;

      this.player.x = ci.x;
      this.player.y = ci.y;
      this.player.index = cardindex;

      // DESTROY OTHER CARD, REPLACE WITH PLAYER
      this.cardArr[cardindex].destroy();
      this.cardArr[cardindex] = this.player;

      if (this.debug) this.player.displayDebug();

      // EMPTY FORMER PLAYER SPOT
      this.cardArr[oldplayerindex] = null;

      // UPDATE SCORE
      this.score++;
      this.updateHud(this.score, this.nTour);

      // ADD NEW CARD FROM END OF ROW OR COL
      this.slideAndAddCard(cardindex, oldplayerindex);

      // UPDATE SIGHT OF PLAYER
      this.updatePlayerInSightIndexes();
    } // END OF DEATH COND
  }

  slideAndAddCard(cardindex, oldplayerindex) {
    let colCard = this.getColNumberOfCard(cardindex);
    let colPlayer = this.getColNumberOfCard(oldplayerindex);
    let rowCard = this.getRowNumberOfCard(cardindex);
    let rowPlayer = this.getRowNumberOfCard(oldplayerindex);

    if (colCard === colPlayer) {
      if (rowCard < rowPlayer) {
        // MOVING UP
        let lastOfCol = this.nRow * this.nCol - (this.nCol - colPlayer);

        for (let i = oldplayerindex; i < lastOfCol; i = i + this.nCol) {
          if (this.cardArr[i + this.nCol] !== null) {
            this.moveCardToIndex(i + this.nCol, i);
          }
        }

        let offsetY =
          this.getYfromIndex(lastOfCol) + this.cardHeight + this.cardPadding;
        this.addCardToArray(lastOfCol, this.getXfromIndex(lastOfCol), offsetY);
        this.moveCardToIndex(lastOfCol, lastOfCol);
        this.flipCardAnim(lastOfCol);
      } else {
        // MOVING DOWN
        let firstOfCol = colPlayer;

        for (let i = oldplayerindex; i > firstOfCol; i = i - this.nCol) {
          if (this.cardArr[i - this.nCol] !== null) {
            this.moveCardToIndex(i - this.nCol, i);
          }
        }

        let offsetY =
          this.getYfromIndex(firstOfCol) - this.cardHeight - this.cardPadding;
        this.addCardToArray(
          firstOfCol,
          this.getXfromIndex(firstOfCol),
          offsetY
        );
        this.moveCardToIndex(firstOfCol, firstOfCol);
        this.flipCardAnim(firstOfCol);
      }
    }
    if (rowPlayer === rowCard) {
      if (colCard < colPlayer) {
        // MOVING LEFT
        let lastOfRow = (rowPlayer + 1) * this.nCol - 1;

        for (let i = oldplayerindex + 1; i <= lastOfRow; i++) {
          if (this.cardArr[i] !== null) {
            this.moveCardToIndex(i, i - 1);
          }
        }

        let offsetX =
          this.getXfromIndex(lastOfRow) + this.cardWidth + this.cardPadding;
        this.addCardToArray(lastOfRow, offsetX);
        this.moveCardToIndex(lastOfRow, lastOfRow);
        this.flipCardAnim(lastOfRow);
      } else {
        // MOVING RIGHT
        let firstOfRow = rowPlayer * this.nCol;
        for (let i = oldplayerindex - 1; i >= firstOfRow; i--) {
          if (this.cardArr[i] !== null) {
            this.moveCardToIndex(i, i + 1);
          }
        }

        let offsetX =
          this.getXfromIndex(firstOfRow) - this.cardWidth - this.cardPadding;
        this.addCardToArray(firstOfRow, offsetX);
        this.moveCardToIndex(firstOfRow, firstOfRow);
        this.flipCardAnim(firstOfRow);
      }
    }
  }

  addCardToArray(
    toindex,
    x = this.getXfromIndex(toindex),
    y = this.getYfromIndex(toindex)
  ) {
    // LOOP SEED IN CASE TOO SHORT
    if (
      this.seed[this.curCardIndex] === null ||
      this.seed[this.curCardIndex] === undefined
    ) {
      console.log("---adding-one-loop-of-seed---");
      this.seed = this.seed.concat(this.seed);
      console.log(this.seed);
    }

    if (this.seed[this.curCardIndex] === "h") {
      this.cardArr[toindex] = new HealCard(this, x, y, toindex, 5, "Ramen");
    } else if (this.seed[this.curCardIndex] === "i") {
      this.cardArr[toindex] = new ItemCard(this, x, y, toindex);
    } else if (this.seed[this.curCardIndex] === "b") {
      this.cardArr[toindex] = new EnemyCard(
        this,
        x,
        y,
        toindex,
        0,
        0,
        null,
        true
      );
    } else {
      this.cardArr[toindex] = new EnemyCard(this, x, y, toindex);
    }
    this.curCardIndex++;

    return this.cardArr[toindex];
  }

  destroyThenAddCard(cardindex, del = 0) {
    let ci = this.cardArr[cardindex];

    // fire particles
    this.explodingParticles.setEmitZone({
      source: new Phaser.Geom.Rectangle(
        ci.x - this.cardWidth / 2,
        ci.y - this.cardHeight / 2,
        this.cardWidth,
        this.cardHeight
      ),
      delay: del * 100 + 100,
      type: "edge",
      quantity: 50
    });
    this.explodingParticles.explode();

    ci.destroy();
    ci = this.addCardToArray(cardindex);
    this.flipCardAnim(cardindex);

    this.score++;
    this.updateHud(this.score, this.nTour);

    this.updatePlayerInSightIndexes();
  }

  damagePlayer(cardindex) {
    let nPlayerDef = this.player.def - this.cardArr[cardindex].def;
    let nCardDef = this.cardArr[cardindex].def - this.player.def;
    this.cardArr[cardindex].def = nCardDef;
    this.player.def = nPlayerDef;
    this.player.updateDef();
    this.scaleUpDownAnim(this.player.defDisplay);
  }
  healPlayer(cardindex = null, heal = 0) {
    let nPlayerDef = 0;
    if (cardindex !== null) {
      nPlayerDef = this.player.def + this.cardArr[cardindex].def;
    } else {
      nPlayerDef = this.player.def + heal;
    }
    if (nPlayerDef >= this.player.maxDef) nPlayerDef = this.player.maxDef;
    this.player.def = nPlayerDef;
    this.player.updateDef();
    this.scaleUpDownAnim(this.player.defDisplay);
  }
  getItem(tween, targets, targetitemcard, forceGetItemId = null) {
    let slotFound = false;
    for (let i = 0; i < this.player.maxInvSlots; i++) {
      if (targetitemcard !== null) {
        if (this.itemDisplay[i].holdedCard === null && slotFound === false) {
          this.itemDisplay[i].insertCard(targetitemcard);
          slotFound = true;
        }
        if (i === this.player.maxInvSlots - 1 && slotFound === false) {
          console.log("NO EMPTY INV SLOT");
        }
      }
      if (forceGetItemId !== null) {
        let it = new ItemCard(this, 0, 0, 0, null, null, forceGetItemId);
        if (this.itemDisplay[i].holdedCard === null && slotFound === false) {
          this.itemDisplay[i].insertCard(it);
          slotFound = true;
        }
        it.destroy();
      }
    }
  }

  moveCardToIndex(fromcardindex, toindex) {
    this.moveCard(fromcardindex, toindex);

    if (this.cardArr[fromcardindex] != null) {
      let cardToMove = this.cardArr[fromcardindex];
      cardToMove.index = toindex;
      cardToMove.x = this.getXfromIndex(toindex);
      cardToMove.y = this.getYfromIndex(toindex);
      this.cardArr[fromcardindex] = null;
      this.cardArr[toindex] = cardToMove;
      if (this.debug) this.cardArr[toindex].displayDebug();
    } else {
      console.log("ERROR // TARGET CARD DOESNT EXIST");
    }
  }

  moveCard(fromcardindex, toindex) {
    let indexToXCoord = this.getXfromIndex(toindex);
    let indexToYCoord = this.getYfromIndex(toindex);
    let c = this.cardArr[fromcardindex];

    let targetList = [];
    targetList.push(c.sprite);
    targetList.push(c.nameDisplay);
    targetList.push(c.defDisplay);
    if (this.debug) targetList.push(c.textDebug);
    if (c.iconDisplay !== null) {
      targetList.push(c.iconDisplay);
    }
    if (c.charSprite !== null) {
      targetList.push(c.charSprite);
    }

    this.tweens.add({
      targets: targetList,
      x: indexToXCoord,
      y: indexToYCoord,
      ease: "Sine.easeIn",
      duration: 500,
      onComplete: function() {}
    });
  }

  flipCardAnim(cardindex, del = 0) {
    let targetList = [];
    let c = this.cardArr[cardindex];

    targetList.push(c.sprite);
    targetList.push(c.nameDisplay);
    targetList.push(c.defDisplay);
    if (this.debug) targetList.push(c.textDebug);
    if (c.iconDisplay !== null) {
      targetList.push(c.iconDisplay);
    }
    if (c.charSprite !== null) {
      targetList.push(c.charSprite);
    }

    let oldtexture = c.textureName;
    targetList[0].setTexture("cardbacksprite");

    for (let i = 1; i < targetList.length; i++) {
      targetList[i].alpha = 0;
    }

    let flipTween = this.tweens.add({
      targets: targetList,
      scaleX: 0,
      ease: "Sine.easeIn",
      duration: 250,
      yoyo: true,
      delay: del,
      onYoyo: function() {
        if (typeof targetList[0] !== "undefined") {
          targetList[0].setTexture(oldtexture);
          for (let i = 1; i < targetList.length; i++) {
            targetList[i].alpha = 1;
          }
        } else {
          flipTween.remove();
        }
      }
    });
  }

  fireShurikenAnim(tocardindex, del = 0) {
    let playerX = this.getXfromIndex(this.player.index);
    let playerY = this.getYfromIndex(this.player.index);
    let shurikenParticles = this.add
      .sprite(playerX, playerY, "shuriken-particle")
      .setDepth(5);
    let toX = this.getXfromIndex(tocardindex);
    let toY = this.getYfromIndex(tocardindex);

    this.tweens.add({
      targets: shurikenParticles,
      x: toX,
      y: toY,
      angle: 360,
      ease: "Sine.easeIn",
      duration: 350,
      delay: del,
      onComplete: function() {
        shurikenParticles.destroy();
      }
    });
  }

  updateHud(score = 0, turn = 0) {
    this.scoreDisplay.setText("SCORE : " + score + " || TOUR N° " + turn);
    if (this.powerButtonDisplay.disabled) {
      let pwb = this.powerButtonDisplay;
      pwb.turnsSinceUsed++;
      console.log(
        "Plus que " +
          (pwb.cooldown - pwb.turnsSinceUsed) +
          " tours avant pouvoir."
      );
      if (pwb.cooldown === pwb.turnsSinceUsed) {
        pwb.enableButton();
      }
    }
  }
  updatePlayerInSightIndexes() {
    this.player.inSightIndexes = [];
    this.cardArr.forEach(c => {
      c.updateInSight();
      if (c.isInSight) this.player.inSightIndexes.push(c.index);
    });
  }

  scaleUpDownAnim(obj) {
    this.tweens.add({
      targets: obj,
      scaleX: 1.1,
      scaleY: 1.05,
      ease: "Sine.easeIn",
      duration: 150,
      yoyo: true,
      repeat: 1,
      onYoyo: function() {}
    });
  }

  shakeCardAnim(
    tween,
    targets,
    cardindex,
    callOnCompleteFunc = null,
    noDamage = false
  ) {
    var timeline = this.tweens.createTimeline();
    let c = this.cardArr[cardindex];

    let targetList = [];
    targetList.push(c.sprite);
    targetList.push(c.nameDisplay);
    if (this.debug) targetList.push(c.textDebug);
    targetList.push(c.defDisplay);
    if (c.iconDisplay !== null) {
      targetList.push(c.iconDisplay);
    }
    if (c.charSprite !== null) {
      targetList.push(c.charSprite);
    }

    if (typeof callOnCompleteFunc === "function") {
      timeline.add({
        targets: targetList,
        scaleX: 0.8,
        scaleY: 0.8,
        ease: "Power1",
        duration: 100
      });
      timeline.add({
        targets: targetList,
        scaleX: 1.2,
        scaleY: 1.2,
        ease: "Power1",
        duration: 100
      });
      timeline.add({
        targets: targetList,
        scaleX: 0.8,
        scaleY: 0.8,
        ease: "Power1",
        duration: 100
      });
      timeline.add({
        targets: targetList,
        scaleX: 0.0,
        scaleY: 0.0,
        ease: "Power1",
        duration: 150,
        onComplete: callOnCompleteFunc,
        onCompleteParams: [cardindex, noDamage],
        onCompleteScope: this
      });
      timeline.play();
    } else {
      console.log("ERROR : onCompleteCall is not function !");
    }
  }

  attackCardAnim(fromcardindex, toindex, onCompletefunc = null) {
    let indexFromXCoord = this.getXfromIndex(fromcardindex);
    let indexFromYCoord = this.getYfromIndex(fromcardindex);

    let indexToXCoord = this.getXfromIndex(toindex);
    let indexToYCoord = this.getYfromIndex(toindex);

    let offset = 10;

    if (indexFromYCoord === indexToYCoord) {
      if (indexFromXCoord < indexToXCoord) {
        indexToXCoord -= this.cardWidth - offset;
      } else {
        indexToXCoord += this.cardWidth - offset;
      }
    }
    if (indexFromXCoord === indexToXCoord) {
      if (indexFromYCoord < indexToYCoord) {
        indexToYCoord -= this.cardHeight - offset;
      } else {
        indexToYCoord += this.cardHeight - offset;
      }
    }

    let c = this.cardArr[fromcardindex];

    let targetList = [];
    targetList.push(c.sprite);
    targetList.push(c.nameDisplay);
    targetList.push(c.defDisplay);
    if (this.debug) targetList.push(c.textDebug);

    this.tweens.add({
      targets: targetList,
      x: indexToXCoord,
      y: indexToYCoord,
      ease: "Sine.easeInOut",
      duration: 100,
      yoyo: true,
      onCompleteScope: this,
      onCompleteParams: [toindex, this.movePlayerToCardAndDestroy],
      onComplete: onCompletefunc
    });
  }

  itemShuriken(atk = 0) {
    // TURN COUNT ++
    this.nTour++;
    this.updateHud(this.score, this.nTour);

    let delay = 0;
    this.player.inSightIndexes.forEach(i => {
      let ci = this.cardArr[i];
      if (ci.constructor.name === "EnemyCard") {
        this.fireShurikenAnim(i, delay * 50);
        delay++;
        ci.updateDef(ci.def - atk);
        if (ci.def <= 0) {
          this.destroyThenAddCard(i, delay);
        } else {
          this.scaleUpDownAnim(ci.defDisplay);
        }
      }
    });
  }

  itemKatanul(cardindex) {
    this.slashingEffect(cardindex);

    let ci = this.cardArr[cardindex];
    let item = this.itemDisplay[this.itemSelected].holdedCard;
    if (ci.constructor.name === "EnemyCard") {
      let nDef = ci.def - item.atk;
      ci.updateDef(nDef);
      if (ci.def <= 0) {
        this.shakeCardAnim(
          null,
          null,
          cardindex,
          this.movePlayerToCardAndDestroy,
          true
        );
      } else {
        this.attackCardAnim(this.player.index, cardindex);
        this.scaleUpDownAnim(ci.defDisplay);
      }
      this.itemDisplay[this.itemSelected].resetSlot();
    } else {
      this.itemDisplay[this.itemSelected].resetTint();
    }
    this.playersTurn = true;
    this.itemSelected = "";
  }

  itemChips(heal) {
    // TURN COUNT ++
    this.nTour++;
    this.updateHud(this.score, this.nTour);

    this.healPlayer(null, heal);
  }

  powerAtk(cardindex) {
    this.slashingEffect(cardindex);

    let ci = this.cardArr[cardindex];
    let atk = Phaser.Math.Between(1, 3);
    if (ci.constructor.name === "EnemyCard") {
      let nDef = ci.def - atk;
      ci.updateDef(nDef);
      if (ci.def <= 0) {
        this.shakeCardAnim(
          null,
          null,
          cardindex,
          this.movePlayerToCardAndDestroy,
          true
        );
      } else {
        this.attackCardAnim(this.player.index, cardindex);
        this.scaleUpDownAnim(ci.defDisplay);
      }
      this.powerButtonDisplay.disableButton();
    } else {
      this.powerButtonDisplay.resetTint();
    }
    this.playersTurn = true;
    this.powerSelected = false;
  }

  slashingEffect(cardindex) {
    let ci = this.cardArr[cardindex];

    // slashing particles
    this.slashingParticles.setEmitZone({
      source: new Phaser.Geom.Line(
        ci.x - this.cardWidth / 2,
        ci.y - this.cardHeight / 4,
        ci.x + this.cardWidth * 4,
        ci.y + this.cardHeight / 2
      ),
      type: "edge",
      quantity: 100
    });
    this.slashingParticles.explode();
  }

  flipCardsRoutine() {
    for (let i = 0; i < this.cardArr.length; i++) {
      this.flipCardAnim(i, i * 150);
    }
  }
}
