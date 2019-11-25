import Phaser from "phaser";

import SceneGameOver from "./SceneGameOver";
import SceneMainMenu from "./SceneMainMenu";
import SceneMain from "./SceneMain";

const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  parent: "game-container",
  backgroundColor: "#010101",
  scene: [SceneMainMenu, SceneMain, SceneGameOver]
};

new Phaser.Game(config);

function resizeApp() {
  let game_ratio = 360 / 640;

  let div = document.getElementById("game-container");
  div.style.width = window.innerHeight * game_ratio + "px";
  div.style.height = window.innerHeight + "px";

  let canvas = document.getElementsByTagName("canvas")[0];

  let dpi_w = parseInt(div.style.width, 1) / canvas.width;
  let dpi_h = parseInt(div.style.height, 1) / canvas.height;

  let height = window.innerHeight * (dpi_w / dpi_h);
  let width = height * game_ratio;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
}

window.addEventListener("resize", resizeApp);

resizeApp();
