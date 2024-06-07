import Player from "./player.js";
import Enemy from "./enemy.js";
import Platform from "./platform.js";
import Brick from "./brick.js";
import { checkCollision } from "./collision.js";

class Game {
  constructor(
    canvasId,
    playerImageId,
    enemiesImageId,
    restartButtonId,
    coinImageId
  ) {
    // Canvas
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Get images from HTML
    this.playerImage = document.getElementById(playerImageId);
    this.enemiesImage = document.getElementById(enemiesImageId); // sprite sheet
    this.coinImage = document.getElementById(coinImageId);

    // Get button from HTML
    this.restartButton = document.getElementById(restartButtonId);

    this.player;
    this.enemies = [];
    this.platforms = [];
    this.bricks = [];
    this.countedBricks = new Set(); // for score counting
    this.collisionDetected = false;
    this.win = false;
    this.score = 0;
    this.startTime;
    this.keys = {}; // Object to track pressed keys

    // Bind event listeners and game loop to Game-object
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.gameLoop = this.gameLoop.bind(this);

    // Add event listener to the button
    this.restartButton.addEventListener("click", this.restartGame);

    // Keyboard input handling
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    this.setupGame();
  }
  setupGame() {
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

    // Initialize platform rectangulars (x, y, w, h, color)
    this.platforms = [
      new Platform(57, 337, 100, 20, "rgba(255, 0, 0, 0.01)"), // transparent
      new Platform(117, 292, 64, 20, "rgba(255, 0, 0, 0.01)"),
      new Platform(
        0,
        this.canvas.height - 180,
        800,
        20,
        "rgba(255, 0, 0, 0.01)"
      ),
    ];

    // Initialize brick rectangulars (x, y, width, height, color, value, coinImage)
    this.bricks = [
      new Brick(520, 270, 40, 50, "rgba(255, 0, 0, 0.01)", 100, coinImage), // transparent
      new Brick(445, 290, 30, 40, "rgba(255, 0, 0, 0.01)", 100, coinImage),
      new Brick(385, 310, 30, 30, "rgba(255, 0, 0, 0.01)", 100, coinImage),
      new Brick(335, 320, 40, 30, "rgba(255, 0, 0, 0.01)", 100, coinImage),
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
    this.enemies.forEach((enemy, index) => {
      if (checkCollision(this.player, enemy)) {
        // Handle player-enemy collision
        // if hit on top, player kills enemy
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
        // Check winning condition
        if (this.enemies.length === 0) {
          this.win = true;
          this.collisionDetected = true; // stop the game
        }
      }
    });
  }

  countCoins() {
    this.bricks.forEach((brick) => {
      if (brick.hit && !this.countedBricks.has(brick)) {
        this.score += brick.score();
        this.countedBricks.add(brick);
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
    this.setupGame();
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

  update() {
    this.player.update(this.keys, this.canvas, this.platforms, this.bricks);
    this.handleEnemyCollisions();
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
    this.countCoins();
  }

  render() {
    this.drawTimeAndScore();
    this.platforms.forEach((platform) => {
      platform.render(this.ctx);
    });
    this.bricks.forEach((brick) => {
      brick.render(this.ctx);
    });

    this.player.render(this.ctx);
    this.enemies.forEach((enemy) => {
      enemy.render(this.ctx);
    });
    this.killEnemies();
  }

  // game loop
  gameLoop() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // if (!this.collisionDetected) {
    //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // }

    this.update();
    this.render();

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
  // Start game
  const game = new Game("gameCanvas", "playerImage", "enemiesImage", "restart");
});
