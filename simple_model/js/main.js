import Player from "./player.js";
import Enemy from "./enemy.js";
import Platform from "./platform.js";
import { checkCollision } from "./collision.js";

class Game {
  constructor(canvasId, playerImageId, enemiesImageId, restartButtonId) {
    // Canvas
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Get images from HTML
    this.playerImage = document.getElementById(playerImageId);
    this.enemiesImage = document.getElementById(enemiesImageId); // sprite sheet

    // Get button from HTML
    this.restartButton = document.getElementById(restartButtonId);

    this.player;
    this.enemies = [];
    this.platforms = [];
    this.collisionDetected = false;

    this.keys = {}; // Object to track pressed keys

    // Bind event listeners and game loop to Game-object
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.gameLoop = this.gameLoop.bind(this);

    // Keyboard input handling
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    this.setupGame();
  }

  setupGame() {
    // Record the start time of the game
    this.collisionDetected = false;

    // Initialize player (x, y, image)
    this.player = new Player(
      this.canvas.width / 2,
      this.canvas.height - this.playerImage.height - 200,
      this.playerImage
    );

    // Initialize enemies (x, y, image, sprite_number)
    this.enemies = [
      new Enemy(
        this.canvas.width,
        this.canvas.height / 2,
        this.enemiesImage,
        1
      ),
      new Enemy(
        this.canvas.width * 1.5,
        this.canvas.height / 2,
        this.enemiesImage,
        2
      ),
      new Enemy(
        this.canvas.width * 2,
        this.canvas.height / 2,
        this.enemiesImage,
        0
      ),
    ];

    // Initialize platform rectangulars (x, y, w, h, color)
    this.platforms = [
      new Platform(
        0,
        this.canvas.height - 180,
        800,
        20,
        "rgba(255, 0, 0, 0.01)" // transparent
      ),
    ];

    // Start game
    this.gameLoop();
  }

  // Key pressed
  handleKeyDown(event) {
    this.keys[event.key] = true;
  }

  // Key released
  handleKeyUp(event) {
    this.keys[event.key] = false;
  }

  handleEnemyCollisions() {
    // Check for collisions between player and enemies
    this.enemies.forEach((enemy) => {
      if (checkCollision(this.player, enemy)) {
        // Handle player-enemy collision
        this.collisionDetected = true; // player dies
      }
    });
  }

  update() {
    this.player.update(this.keys, this.canvas, this.platforms);
    this.handleEnemyCollisions();
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
  }

  render() {
    this.platforms.forEach((platform) => {
      platform.render(this.ctx);
    });

    this.player.render(this.ctx);
    this.enemies.forEach((enemy) => {
      enemy.render(this.ctx);
    });
  }

  // game loop
  gameLoop() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.update();
    this.render();

    if (!this.collisionDetected) {
      // If collision hasn't occurred, continue the game loop
      requestAnimationFrame(this.gameLoop);
      // Collision detected, stop the game
    } else {
      //lose
      console.log("You lose!");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Start game
  const game = new Game("gameCanvas", "playerImage", "enemiesImage", "restart");
});
