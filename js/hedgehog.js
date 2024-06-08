// a class for training purpose
export default class Hedgehog {
  debug = false;
  constructor(x, y, velocityX, velocityY) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.orginalX = x;
    this.orginalY = y;
    this.image = document.getElementById("enemiesImage"); // sprite sheet
    // distance between sprites
    this.spriteWidth = 30;
    this.spriteHeight = 30;
    // select a sprite from the sprite sheet
    this.sprite_number = 3;
    this.spriteX = 0;
    this.spriteY = 9;
    this.spriteOffsetX = 14;
    this.spriteOffsetY = 8;
    this.width = 16;
    this.height = 15;
  }

  update() {
    if (!this.hit) {
      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    // move hedgehog to the right again, random distance from canvas
    if (this.x < -this.width) {
      this.x = this.orginalX;
      this.y = this.orginalY;
    }
  }

  render(ctx) {
    // Render hedgehog on canvas
    //ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    if (this.debug) {
      // Draw black borders around the sprite
      const borderSize = 1;
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        this.x - borderSize,
        this.y - borderSize,
        this.width * 2 + borderSize * 2,
        this.height * 2 + borderSize * 2
      );
    }

    // 9 argument command (image, sx, sy, sw, sh, dx, dy, dw, dh)  -> s= source, d= destination
    ctx.drawImage(
      this.image,
      this.spriteOffsetX + this.spriteX * this.spriteWidth,
      this.spriteOffsetY + this.spriteY * this.spriteHeight,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
