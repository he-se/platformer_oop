export default class Player {
  debug = true;

  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    //this.yBaseLevel = y;
    this.image = image;

    this.width = 31;
    this.height = 58;

    this.speed = 5;
    this.velocityX = 0;
    this.velocityY = 0;
    this.jumpStrength = 10;
    this.gravity = 0.5;
    this.isOnGround = false;
  }

  moveLeft() {
    this.velocityX = -this.speed;
    this.x += this.velocityX;
  }

  moveRight() {
    this.velocityX = this.speed;
    this.x += this.velocityX;
  }

  jump() {
    if (this.isOnGround) {
      this.velocityY = -this.jumpStrength;
      this.isOnGround = false;
    }
  }

  // Method to check collision with a platform. Standard algorith for two rectangular objects
  isColliding(platform) {
    return (
      this.x < platform.x + platform.width &&
      this.x + this.width > platform.x &&
      this.y < platform.y + platform.height &&
      this.y + this.height > platform.y
    );
  }

  update(keys, canvas, platforms) {
    // Apply gravity
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    // Collision detection with platforms (each platform in the array)
    this.isOnGround = false; // Reset flag
    platforms.forEach((platform) => {
      if (this.isColliding(platform)) {
        if (this.velocityY > 0 && this.y + this.height < platform.y + 20) {
          // Player is falling or standing on the platform
          this.y = platform.y - this.height; // Snap player to top of platform
          this.velocityY = 0; // Stop downward velocity
          this.isOnGround = true; // Player is on the ground
        } else if (
          this.velocityY < 0 &&
          this.y > platform.y + platform.height - 20
        ) {
          // Player is jumping and hits the ceiling
          this.y = platform.y + platform.height; // Snap player to bottom of platform
          this.velocityY = 0; // Stop upward velocity
        } else if (this.velocityX > 0) {
          // Player is moving right
          this.x = platform.x - this.width; // Snap player to left edge of platform
        } else if (this.velocityX < 0) {
          // Player is moving left
          this.x = platform.x + platform.width; // Snap player to right edge of platform
        }
      }
    });

    // Update player position based on input
    if (keys["ArrowLeft"]) {
      if (this.x > 0) this.moveLeft();
    }
    if (keys["ArrowRight"]) {
      if (this.x < canvas.width - this.width) this.moveRight();
    }
    if (keys["ArrowUp"]) {
      this.jump();
      keys["ArrowUp"] = false;
    }
  }

  render(ctx) {
    // Render player on canvas
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    if (this.debug) {
      // Draw black borders around the sprite
      const borderSize = 1;
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        this.x - borderSize,
        this.y - borderSize,
        this.width + borderSize * 2,
        this.height + borderSize * 2
      );
    }
  }
}
