import Phaser from "phaser";

export default class InvSlot extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.key = key;
    this.sprite = scene.add
      .sprite(x, y, "invslotsprite", 0)
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerdown", this.onPointerDownHandler, this)
      .on("pointerup", this.onPointerUpHandler, this);
    this.sprite.setDepth(2);

    this.holdedCard = null;
    this.selected = false;

    this.defDisplay = scene.add.text(x + 15, y - 24, "", {
      font: "14px digital",
      fill: "#e6e125"
    });
    this.defDisplay.setDepth(2);

    this.nameDisplay = scene.add.text(x - 28, y - 7, "", {
      font: "11px digital",
      fill: "#e6e125"
    });
    this.nameDisplay.setDepth(2);
    this.iconDisplay = null;
  }

  insertCard(targetitemcard) {
    if (targetitemcard != null) {
      this.holdedCard = targetitemcard;
      this.sprite.setTexture("invslotcardsprite");
      this.nameDisplay.setText(this.holdedCard.name);

      if (this.holdedCard.type === 12) {
        this.iconDisplay = this.scene.add.sprite(
          this.sprite.x + 7,
          this.sprite.y - 15,
          "item-def"
        );
        this.defDisplay.setText("+" + this.holdedCard.def);
      } else {
        this.iconDisplay = this.scene.add.sprite(
          this.sprite.x + 7,
          this.sprite.y - 15,
          "item-atk"
        );
        this.defDisplay.setText("+" + this.holdedCard.atk);
      }
      this.iconDisplay.setScale(0.75).setDepth(2);
    }
  }

  resetSlot() {
    this.holdedCard.destroy();
    this.holdedCard = null;
    this.resetTint();
    this.sprite.setTexture("invslotsprite");
    this.nameDisplay.setText("");
    this.defDisplay.setText("");
    if (this.iconDisplay != null) this.iconDisplay.destroy();
  }
  resetTint() {
    this.sprite.clearTint();
    this.defDisplay.clearTint();
    this.nameDisplay.clearTint();
    this.iconDisplay.clearTint();
  }

  onPointerDownHandler(pointer) {
    this.sprite.setTint(0xff7700);
    this.defDisplay.setTint(0xff7700);
    this.nameDisplay.setTint(0xff7700);
    this.iconDisplay.setTint(0xff7700);
  }
  onPointerUpHandler(pointer) {
    this.sprite.setTint(0xffffff);
    // console.log(this.holdedCard.type);
    if (this.scene.playersTurn) {
      if (this.holdedCard != null) {
        if (this.holdedCard.type === 10) {
          this.scene.itemShuriken(this.holdedCard.atk);
          this.resetSlot();
        } else if (this.holdedCard.type === 11 || this.holdedCard.type === 13) {
          this.scene.playersTurn = false;
          this.scene.itemSelected = this.key;
          this.sprite.setTint(0xff7700);
          this.defDisplay.setTint(0xff7700);
          this.nameDisplay.setTint(0xff7700);
        } else if (this.holdedCard.type === 12) {
          this.scene.itemChips(this.holdedCard.def);
          this.resetSlot();
        }
      }
    } else {
      this.resetTint();
      this.scene.playersTurn = true;
      this.scene.itemSelected = "";
    }
  }
  destroy() {
    this.nameDisplay.destroy();
    this.defDisplay.destroy();
    this.sprite.destroy();
    if (this.iconDisplay != null) this.iconDisplay.destroy();
  }
}
