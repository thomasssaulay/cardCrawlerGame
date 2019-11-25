import Card from "./Cards";

export default class PlayerCard extends Card {
  constructor(scene, x, y, key, atk, def, name) {
    super(scene, x, y, key, atk, def, name);
    this.textureName = "playercardsprite";
    this.sprite.setTexture(this.textureName);
    this.maxDef = 12;
    this.maxInvSlots = 3;
    this.itemList = [];
    this.inSightIndexes = [];

    let defOffsetX = this.scene.cardWidth / 4;
    let defOffsetY = this.scene.cardHeight / 2.02;
    this.defDisplay = scene.add.text(x, y, this.def + "/" + this.maxDef, {
      font: "20px digital-mono",
      fill: "#010101"
    });
    this.defDisplay.setDisplayOrigin(defOffsetX, defOffsetY);

    let nameOffsetX = this.scene.cardWidth / 2 - this.scene.cardWidth * 0.17;
    let nameOffsetY = this.scene.cardHeight / 2 - this.scene.cardHeight * 0.18;
    this.nameDisplay = scene.add.text(x, y, this.name, {
      font: "14px digital",
      fill: "#1592d5"
    });
    this.nameDisplay.setDisplayOrigin(nameOffsetX, nameOffsetY);
  }

  updateDef() {
    if (this.def < 10) {
      this.defDisplay.setText(" " + this.def + "/" + this.maxDef);
    } else {
      this.defDisplay.setText(this.def + "/" + this.maxDef);
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
  onPointerUpHandler() {
    this.sprite.setTint(0xffffff);
  }
}
