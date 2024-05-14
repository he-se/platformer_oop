import Player from "./player.js";
import Enemy from "./enemy.js";
import Platform from "./platform.js";
import { checkCollision } from "./collision.js";

class Game {
  constructor(canvasId, playerImageId, enemiesImageId, restartButtonId) {
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
    this.win = false;
    this.score = 0;
    this.startTime;
    this.keys = {}; // Object to track pressed keys

    // Bind event listeners and game loop
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    // Add event listener to the button
    this.restartButton.addEventListener("click", this.restartGame);

    // Keyboard input handling
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    this.init();
  }
  init() {
    // Record the start time of the game
    this.startTime = Date.now();
    this.collisionDetected = false;
    this.win = false;
    this.score = 0;

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
        0
      ),
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
      new Enemy(
        this.canvas.width * 1.2,
        (9 * this.canvas.height) / 10,
        this.enemiesImage,
        3
      ),
    ];

    // Initialize platforms (x, y, w, h)
    this.platforms = [
      new Platform(57, 337, 100, 20),
      new Platform(117, 292, 64, 20),
      new Platform(0, this.canvas.height - 180, 800, 20),
    ];
    this.gameLoop();
  }

  handleKeyDown(event) {
    this.keys[event.key] = true;
  }

  handleKeyUp(event) {
    this.keys[event.key] = false;
  }

  handleEnemyCollisions() {
    // Check for collisions between player and enemies
    this.enemies.forEach((enemy, index) => {
      if (checkCollision(this.player, enemy)) {
        // Handle player-enemy collision
        // if hit on top
        if (
          this.player.velocityY > 0 &&
          this.player.y + this.player.height < enemy.y + 20
        ) {
          // player kills enemy
          enemy.hit = true;
          this.killEnemies();
        } else if (!enemy.hit) this.collisionDetected = true; // player dies
      }
    });
  }

  killEnemies() {
    // Check if enemy is not alive
    this.enemies.forEach((enemy, index) => {
      if (!enemy.alive) {
        // remove enemy
        this.enemies.splice(index, 1); // Remove the enemy from the array
        this.score += 100;
        if (this.enemies.length === 0) {
          this.win = true;
          this.collisionDetected = true; // stop the game
        }
      }
    });
  }

  writeEndText(win) {
    // win/lose message
    const message = win ? "You Win!" : "Game Over";
    this.ctx.save();
    this.ctx.fillStyle = "rgb(0,0,0,0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.font = " 130px Helvetica";
    this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.restore();
  }

  restartGame() {
    this.restartButton.style.display = "none";
    // Reset all variables and start a new
    this.init();
  }

  drawTimeAndScore() {
    // Calculate elapsed time
    const elapsedTime = Date.now() - this.startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    // Display elapsed time and score in the top-left corner
    this.ctx.fillStyle = "white";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(
      `Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`,
      10,
      20
    );
    this.ctx.fillText(`Score: ${this.score}`, 100, 20);
  }

  // game loop
  gameLoop() {
    // Check if collision has not occurred
    if (!this.collisionDetected) {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.drawTimeAndScore();
    this.platforms.forEach((platform) => {
      platform.render(this.ctx);
    });
    this.player.update(this.keys, this.canvas, this.platforms);
    this.handleEnemyCollisions();
    this.player.render(this.ctx);
    this.enemies.forEach((enemy) => {
      enemy.update();
      enemy.render(this.ctx);
    });
    this.killEnemies();

    if (!this.collisionDetected) {
      // If collision hasn't occurred, continue the game loop
      requestAnimationFrame(this.gameLoop);
      // Collision detected, stop the game
    } else if (this.win) {
      // win
      this.writeEndText(true);
      this.restartButton.style.display = "inline-block";
      this.drawTimeAndScore();
    } else {
      //lose
      this.writeEndText(false);
      this.restartButton.style.display = "inline-block";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game("gameCanvas", "playerImage", "enemiesImage", "restart");
});
