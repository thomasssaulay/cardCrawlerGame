import Phaser from "phaser";

export default class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, atk, def, name) {
    super(scene, x, y, key);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.index = key;
    this.def = def;
    this.atk = atk;
    this.name = name;
    this.isBoss = false;
    this.isInSight = false;
    this.nameDisplay = null;
    this.defDisplay = null;
    this.iconDisplay = null;

    this.textDebug = scene.add.text(x, y, "", {
      font: "17px digital",
      fill: "#FDA"
    });
    this.textDebug.setDepth(1);
    this.textDebug.setOrigin(0.5, 0.5);
    if (scene.debug) this.displayDebug();

    this.textureName = "";
    this.sprite = scene.add
      .sprite(x, y, "cardbacksprite", 0)
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerdown", this.onPointerDownHandler, this)
      .on("pointerup", this.onPointerUpHandler, this);

    this.charSpriteTextureName = "";
    this.charSprite = null;
  }

  onPointerDownHandler() {
    // this.sprite.setTint(0xaaaaaa);
  }
  onPointerUpHandler() {}
  displayDebugText() {
    this.textDebug.setText(
      "Index : " +
        this.index +
        "\n" +
        this.name +
        "\nATK : " +
        this.atk +
        "\nDEF : " +
        this.def +
        "\n" +
        this.x +
        " " +
        this.y
    );
  }
  hideDebug() {
    this.textDebug.setText("");
  }

  update() {}

  updateInSight() {
    if (this.index !== this.scene.player.index) {
      if (
        (this.index === this.scene.player.index + 1 &&
          (this.scene.player.index + 1) % this.scene.nCol !== 0) ||
        (this.index === this.scene.player.index - 1 &&
          (this.scene.player.index - 1) % this.scene.nCol !==
            this.scene.nCol - 1) ||
        this.index === this.scene.player.index + this.scene.nCol ||
        this.index === this.scene.player.index - this.scene.nCol
      ) {
        this.isInSight = true;
        this.sprite.setTint(0xffffff);
        this.nameDisplay.setTint(0xffffff);
        this.defDisplay.setTint(0xffffff);
        if (this.iconDisplay !== null) this.iconDisplay.setTint(0xffffff);
        if (this.charSprite !== null) this.charSprite.setTint(0xffffff);
      } else {
        this.isInSight = false;
        this.sprite.setTint(0x888888);
        this.nameDisplay.setTint(0x888888);
        this.defDisplay.setTint(0x888888);
        if (this.iconDisplay !== null) this.iconDisplay.setTint(0x888888);
        if (this.charSprite !== null) this.charSprite.setTint(0x888888);
      }
    }
  }

  destroy() {
    this.sprite.destroy();
    this.textDebug.destroy();
    this.nameDisplay.destroy();

    if (typeof this.defDisplay !== "undefined") this.defDisplay.destroy();
    if (this.charSpriteTextureName !== "") this.charSprite.destroy();

    if (this.iconDisplay !== "null" && this.constructor.name === "ItemCard") {
      this.iconDisplay.destroy();
    }
  }
}
