import Phaser from "phaser";
import Card from "./Cards";

export default class ItemCard extends Card {
  constructor(scene, x, y, key, atk = 0, def = 0, objid = null) {
    super(scene, x, y, key, atk, def, objid);
    this.textureName = "itemcardsprite";
    this.sprite.setTexture(this.textureName);

    // TODO :  JSON list of ennemies etc...
    let enList = [
      [10, "Shuriken", 0, 2, "shuriken"],
      [11, "Katanul", 0, 1, "katanul"],
      [12, "Chips aux \ncrevettes", 3, 0, "chips"],
      [10, "Shuriken", 0, 1, "shuriken"],
      [11, "Katanul", 0, 2, "katanul"],
      [12, "Chips aux \ncrevettes", 2, 0, "chips"],
      [13, "Nunchaku\nen 8.6", 0, 3, ""]
      // [14, "Déguisement", 3, 0]
    ];

    if (objid === null || objid === undefined) {
      let r = Phaser.Math.Between(0, enList.length - 1);

      this.type = enList[r][0];
      this.name = enList[r][1];
      this.def = enList[r][2];
      this.atk = enList[r][3];
      this.charSpriteTextureName = enList[r][4];
    } else {
      this.type = enList[objid][0];
      this.name = enList[objid][1];
      this.def = enList[objid][2];
      this.atk = enList[objid][3];
      this.charSpriteTextureName = enList[objid][4];
    }
    this.charSprite = scene.add.sprite(
      x,
      y + 10,
      this.charSpriteTextureName,
      0
    );

    let defOffsetX = -this.scene.cardWidth / 5;
    let defOffsetY = this.scene.cardHeight / 2.02;
    let iconOffsetX = -this.scene.cardWidth / 20;
    let iconOffsetY = this.scene.cardHeight / 2.2;
    if (this.type === 12) {
      this.iconDisplay = scene.add.sprite(x, y, "item-def");
      this.defDisplay = scene.add.text(x, y, "+" + this.def, {
        font: "20px digital",
        fill: "#e6e125"
      });
    } else {
      this.iconDisplay = scene.add.sprite(x, y, "item-atk");
      this.defDisplay = scene.add.text(x, y, "+" + this.atk, {
        font: "20px digital",
        fill: "#e6e125"
      });
    }
    this.iconDisplay.setDisplayOrigin(iconOffsetX, iconOffsetY);
    this.defDisplay.setDisplayOrigin(defOffsetX, defOffsetY);

    let nameOffsetX = this.scene.cardWidth / 2 - this.scene.cardWidth * 0.2;
    let nameOffsetY = this.scene.cardHeight / 2 - this.scene.cardHeight * 0.18;
    this.nameDisplay = scene.add.text(x, y, this.name, {
      font: "14px digital",
      fill: "#e6e125"
    });
    this.nameDisplay.setDisplayOrigin(nameOffsetX, nameOffsetY);
  }

  displayDebug() {
    this.textDebug.setText(
      "Index : " +
        this.index +
        "\nITEM\n" +
        this.name +
        "\n+" +
        this.atk +
        "\n" +
        this.x +
        " " +
        this.y
    );
  }
  onPointerUpHandler(pointer) {
    // this.sprite.setTint(0xffffff);
    this.scene.onCardPointerUpHandler(this.index, pointer);
  }
}
