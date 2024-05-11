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
    this.velocityY = 0;
    this.jumpStrength = 10;
    this.gravity = 0.5;
    this.isOnGround = false;
    this.isFacingLeft = false; // Flag to track player direction
  }

  moveLeft() {
    this.x += -this.speed;
    this.isFacingLeft = true;
  }

  moveRight() {
    this.x += this.speed;
    this.isFacingLeft = false;
  }

  jump() {
    if (this.isOnGround) {
      this.velocityY = -this.jumpStrength;
      this.isOnGround = false;
    }
  }

  update(keys, canvas) {
    // Apply gravity
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    // Check for collision with the ground
    if (this.y > this.yBaseLevel) {
      this.isOnGround = true;
      this.y = this.yBaseLevel;
    }

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
