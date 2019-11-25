import Card from "./Cards";

export default class HealCard extends Card {
  constructor(scene, x, y, key, def, name) {
    super(scene, x, y, key, null, def, name);
    this.textureName = "healcardsprite";
    this.sprite.setTexture(this.textureName);

    let defOffsetX = -this.scene.cardWidth / 5;
    let defOffsetY = this.scene.cardHeight / 2.02;
    this.defDisplay = scene.add.text(x, y, "+" + this.def, {
      font: "20px digital-mono",
      fill: "#88c93b"
    });
    this.defDisplay.setDisplayOrigin(defOffsetX, defOffsetY);

    let nameOffsetX = this.scene.cardWidth / 2 - this.scene.cardWidth * 0.2;
    let nameOffsetY = this.scene.cardHeight / 2 - this.scene.cardHeight * 0.18;
    this.nameDisplay = scene.add.text(x, y, this.name, {
      font: "14px digital",
      fill: "#88c93b"
    });
    this.nameDisplay.setDisplayOrigin(nameOffsetX, nameOffsetY);
  }

  displayDebug() {
    this.textDebug.setText(
      "Index : " +
        this.index +
        "\n" +
        this.name +
        "\nHEAL : " +
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
