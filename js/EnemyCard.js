import Phaser from "phaser";
import Card from "./Cards";

export default class EnemyCard extends Card {
  constructor(scene, x, y, key, atk = 0, def = 0, name = null, isBoss = false) {
    super(scene, x, y, key, atk, def, name);
    this.isBoss = isBoss;

    let defOffsetX = -this.scene.cardWidth / 4.5;
    let defOffsetY = this.scene.cardHeight / 2.02;

    let nameOffsetX = this.scene.cardWidth / 2 - this.scene.cardWidth * 0.2;
    let nameOffsetY = this.scene.cardHeight / 2 - this.scene.cardHeight * 0.18;

    if (isBoss) {
      this.textureName = "bosscardsprite";
      this.sprite.setTexture(this.textureName);
      this.name = "Le Shogun";
      this.def = 10;
      this.atk = 4;

      if (this.def < 10) {
        this.defDisplay = scene.add.text(x, y, this.def + " ", {
          font: "20px digital-mono",
          fill: "#d01208"
        });
      } else {
        this.defDisplay = scene.add.text(x, y, this.def, {
          font: "20px digital-mono",
          fill: "#d01208"
        });
      }
      this.nameDisplay = scene.add.text(x, y, this.name, {
        font: "14px digital",
        fill: "#d01208"
      });
    } else if (name === null || name === undefined) {
      this.textureName = "enemycardsprite";
      this.sprite.setTexture(this.textureName);
      // TODO :  JSON list of ennemies etc...
      let enList = [
        ["TurboNinja", 2, 1, "turboninja"],
        ["Photocop", 4, 1, "photocop"],
        ["Stagiaire\nSouple", 1, 1, "stagiaire"]
      ];

      let r = Phaser.Math.Between(0, enList.length - 1);

      this.name = enList[r][0];
      this.def = enList[r][1];
      this.atk = enList[r][2];
      this.charSpriteTextureName = enList[r][3];
      this.charSprite = scene.add.sprite(
        x,
        y + 10,
        this.charSpriteTextureName,
        0
      );

      if (this.def < 10) {
        this.defDisplay = scene.add.text(x, y, this.def + " ", {
          font: "20px digital-mono",
          fill: "#da3c8f"
        });
      } else {
        this.defDisplay = scene.add.text(x, y, this.def, {
          font: "20px digital-mono",
          fill: "#da3c8f"
        });
      }
      this.nameDisplay = scene.add.text(x, y, this.name, {
        font: "14px digital",
        fill: "#da3c8f"
      });
    }
    this.defDisplay.setDisplayOrigin(defOffsetX, defOffsetY);
    this.nameDisplay.setDisplayOrigin(nameOffsetX, nameOffsetY);
  }

  updateDef(ndef = null) {
    if (ndef === null) this.defDisplay.setText(this.def);
    else {
      this.def = ndef;
      if (ndef < 10) this.defDisplay.setText(this.def + " ");
      else this.defDisplay.setText(this.def);
    }
  }

  displayDebug() {
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
  onPointerUpHandler(pointer) {
    // this.sprite.setTint(0xffffff);

    this.scene.onCardPointerUpHandler(this.index, pointer);
  }
}
