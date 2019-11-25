import Phaser from "phaser";

export default class PowerButton extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, powerName = "Pouvoir", powerDesc = "1 - 3") {
    super(scene, x, y, key);
    this.key = key;
    this.sprite = scene.add
      .sprite(x, y, "power-button", 0)
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerdown", this.onPointerDownHandler, this)
      .on("pointerup", this.onPointerUpHandler, this);
    this.sprite.setDepth(2);

    this.selected = false;
    this.cooldown = 3;
    this.disabled = false;
    this.turnsSinceUsed = 0;

    this.defDisplay = scene.add.text(x + 30, y - 0, powerDesc, {
      font: "12px digital",
      fill: "#1592d5"
    });
    this.defDisplay.setDepth(2);

    this.nameDisplay = scene.add.text(x - 25, y - 8, powerName, {
      font: "15px digital",
      fill: "#1592d5"
    });
    this.nameDisplay.setDepth(2);
  }
  resetTint() {
    this.sprite.clearTint();
    this.defDisplay.clearTint();
    this.nameDisplay.clearTint();
  }
  disableButton() {
    this.disabled = true;
    this.sprite.setTint(0xff7700);
    this.defDisplay.setTint(0xff7700);
    this.nameDisplay.setTint(0xff7700);
    this.sprite.removeAllListeners();
  }
  enableButton() {
    this.disabled = false;
    this.turnsSinceUsed = 0;
    this.resetTint();
    this.sprite.on("pointerdown", this.onPointerDownHandler, this);
    this.sprite.on("pointerup", this.onPointerUpHandler, this);
  }

  onPointerDownHandler(pointer) {
    this.sprite.setTint(0xff7700);
    this.defDisplay.setTint(0xff7700);
    this.nameDisplay.setTint(0xff7700);
  }

  onPointerUpHandler(pointer) {
    this.sprite.setTint(0xffffff);

    if (this.scene.playersTurn) {
      this.scene.playersTurn = false;
      this.scene.powerSelected = true;
      this.sprite.setTint(0xff7700);
      this.defDisplay.setTint(0xff7700);
      this.nameDisplay.setTint(0xff7700);
    } else {
      this.resetTint();
      this.scene.playersTurn = true;
    }
  }
}
