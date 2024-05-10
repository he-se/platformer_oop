import Player from "./player.js";
//import Enemy from "./enemy.js";
import Platform from "./platform.js";
import { checkCollision, handleCollisions } from "./collision.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Load player image
  const playerImage = new Image();
  playerImage.src = "./images/super-mario_31x58.png";

  // Initialize player (x, y, image)
  const player = new Player(
    canvas.width / 2,
    canvas.height - playerImage.height - 180,
    playerImage
  );

  // Initialize platforms (x, y, w, h)
  const platforms = [
    new Platform(100, 400, 200, 20),
    new Platform(300, 300, 150, 20),
  ];

  // Keyboard input handling
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  let keys = {}; // Object to track pressed keys

  function handleKeyDown(event) {
    keys[event.key] = true;
  }

  function handleKeyUp(event) {
    keys[event.key] = false;
  }

  function drawBackground() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function renderPlatforms() {
    platforms.forEach((platform) => {
      platform.render(ctx);
    });
  }

  // Other functions remain the same...

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawBackground();
    renderPlatforms();
    //updatePlayer();
    player.update(keys, canvas);
    //handlePlayerPlatformCollision();
    player.render(ctx);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
