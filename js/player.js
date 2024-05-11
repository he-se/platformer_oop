export default class Player {
  debug = false;
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.yBaseLevel = y;
    this.image = image;

    this.width = 31;
    this.height = 58;

    this.speed = 5;
    this.velocityX = 0;
    this.velocityY = 0;
    this.jumpStrength = 10;
    this.gravity = 0.5;
    this.isOnGround = false;
    this.isFacingLeft = false; // Flag to track player direction
  }

  moveLeft() {
    this.velocityX = -this.speed;
    this.x += this.velocityX;
    this.isFacingLeft = true;
  }

  moveRight() {
    this.velocityX = this.speed;
    this.x += this.velocityX;
    this.isFacingLeft = false;
  }

  jump() {
    if (this.isOnGround) {
      this.velocityY = -this.jumpStrength;
      this.isOnGround = false;
    }
  }

  update(keys, canvas, platforms) {
    // Apply gravity
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    // Check for collision with the ground
    // if (this.y > this.yBaseLevel) {
    //   this.isOnGround = true;
    //   this.y = this.yBaseLevel;
    // }

    // Collision detection with platforms
    this.isOnGround = false; // Reset flag
    platforms.forEach((platform) => {
      if (this.isColliding(platform)) {
        if (this.velocityY > 0 && this.y + this.height < platform.y + 20) {
          // Player is falling
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

    // Update player position based on input or other factors
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

  // Method to check collision with a platform horizontally
  isColliding(platform) {
    return (
      this.x < platform.x + platform.width &&
      this.x + this.width > platform.x &&
      this.y < platform.y + platform.height &&
      this.y + this.height > platform.y
    );
  }

  render(ctx) {
    // Render player on canvas
    //ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    // Save the current transformation matrix
    ctx.save();

    // Flip the player image horizontally if facing left
    if (this.isFacingLeft) {
      ctx.scale(-1, 1); // Flip horizontally
    }

    // Draw black borders around the sprite
    if (this.debug) {
      const borderSize = 1;
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        this.isFacingLeft
          ? -this.x + borderSize - this.width
          : this.x - borderSize,
        this.y - borderSize,
        this.width + borderSize * 2,
        this.height + borderSize * 2
      );
    }

    // Render player image on canvas
    ctx.drawImage(
      this.image,
      this.isFacingLeft ? -this.x - this.width : this.x,
      this.y,
      this.width,
      this.height
    );

    // Restore the previous transformation matrix
    ctx.restore();
  }
}
