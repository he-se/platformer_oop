import Player from "./player.js";
import Enemy from "./enemy.js";
import Platform from "./platform.js";
import { checkCollision, handlePlayerCollisions } from "./collision.js";

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

  // Initialize enemies (x, y, image, sprite_number)
  const enemies = [
    new Enemy(canvas.width, canvas.height / 2, enemiesImage, 0),
    new Enemy(canvas.width, canvas.height / 2, enemiesImage, 1),
    new Enemy(canvas.width * 1.5, canvas.height / 2, enemiesImage, 2),
    new Enemy(canvas.width * 2, canvas.height / 2, enemiesImage, 3),
  ];

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

  function handleCollisions() {
    // Check for collisions between player and enemies
    enemies.forEach((enemy) => {
      if (checkCollision(player, enemy)) {
        // Handle player-enemy collision (e.g., decrease player health)
        collisionDetected = true;
      }
      console.log(checkCollision(player, enemy));
    });
  }

  // game loop
  let collisionDetected = false;
  function gameLoop() {
    // Check if collision has not occurred
    if (!collisionDetected) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    //drawBackground();
    renderPlatforms(ctx);
    player.update(keys, canvas);
    handleCollisions();
    player.render(ctx);
    enemies.forEach((enemy) => {
      enemy.update();
      enemy.render(ctx);
    });

    if (!collisionDetected) {
      // If collision hasn't occurred, continue the game loop
      requestAnimationFrame(gameLoop);
    } else {
      // Collision detected, stop the game
      console.log("Collision detected, game stopped.");
    }
  }

  gameLoop();
});
