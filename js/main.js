import Player from "./player.js";
import Enemy from "./enemy.js";
import Platform from "./platform.js";
import { checkCollision, handlePlayerCollisions } from "./collision.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let startTime = Date.now(); // Record the start time of the game

  // Get images from HTML
  const playerImage = document.getElementById("playerImage");
  const enemiesImage = document.getElementById("enemiesImage"); // sprite sheet

  // Initialize player (x, y, image)
  const player = new Player(
    canvas.width / 2,
    canvas.height - playerImage.height - 200,
    playerImage
  );

  // Initialize enemies (x, y, image, sprite_number)
  const enemies = [
    new Enemy(canvas.width, canvas.height / 2, enemiesImage, 0),
    new Enemy(canvas.width, canvas.height / 2, enemiesImage, 1),
    new Enemy(canvas.width * 1.5, canvas.height / 2, enemiesImage, 2),
    new Enemy(canvas.width * 2, canvas.height / 2, enemiesImage, 0),
    new Enemy(canvas.width * 1.2, (9 * canvas.height) / 10, enemiesImage, 3),
  ];

  // Initialize platforms (x, y, w, h)
  const platforms = [
    new Platform(57, 337, 100, 20),
    new Platform(117, 292, 64, 20),
    new Platform(0, canvas.height - 180, 800, 20),
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

  function handleEnemyCollisions() {
    // Check for collisions between player and enemies
    enemies.forEach((enemy, index) => {
      if (checkCollision(player, enemy)) {
        // Handle player-enemy collision
        if (player.velocityY > 0 && player.y + player.height < enemy.y + 20) {
          // player kills enemy
          enemy.hit = true;
        } else if (!enemy.hit) collisionDetected = true; // player dies
      }
    });
  }

  function killEnemies() {
    // Check if enemy is not alive
    enemies.forEach((enemy, index) => {
      if (!enemy.alive) {
        // remove enemy
        enemies.splice(index, 1); // Remove the enemy from the array
        if (enemies.length === 0) console.log(" You win!");
      }
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
    // Calculate elapsed time
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    // Display elapsed time in the top-left corner
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(
      `Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`,
      10,
      20
    );

    //drawBackground();
    renderPlatforms(ctx);
    player.update(keys, canvas, platforms);
    handleEnemyCollisions();
    player.render(ctx);
    enemies.forEach((enemy) => {
      enemy.update();
      enemy.render(ctx);
    });

    killEnemies();

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
