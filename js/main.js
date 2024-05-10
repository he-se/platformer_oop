import Player from "./player.js";
import Enemy from "./enemy.js";
import Platform from "./platform.js";
import { checkCollision, handleCollisions } from "./collision.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Get images from HTML
  const playerImage = document.getElementById("playerImage");
  const enemiesImage = document.getElementById("enemiesImage"); // sprite sheet

  // Initialize player (x, y, image)
  const player = new Player(
    canvas.width / 2,
    canvas.height - playerImage.height - 180,
    playerImage
  );

  // Initialize enemy (x, y, image)
  const enemy = new Enemy(canvas.width, canvas.height / 2, enemiesImage);

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

  function renderPlatforms(ctx) {
    platforms.forEach((platform) => {
      platform.render(ctx);
    });
  }

  // game loop
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawBackground();
    renderPlatforms(ctx);
    player.update(keys, canvas);
    //handlePlayerPlatformCollision();
    player.render(ctx);
    enemy.update();
    enemy.render(ctx);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
