export default class Enemy {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.speed = -1;
    // select a sprite from the sprite sheet
    this.spriteX = 4;
    this.spriteY = 2;
    this.spriteOffsetX = 0;
    this.spriteOffsetY = 20;
    this.spriteWidth = 30;
    this.spriteHeight = 30;
  }

  update() {
    this.x += this.speed;
  }

  render(ctx) {
    // Render enemy on canvas
    //ctx.drawImage(this.image, this.x, this.y, this.spriteWidth, this.spriteHeight);
    // 9 argument command (image, sx, sy, sw, sh, dx, dy, dw, dh)  -> s= source, d= destination
    ctx.drawImage(
      this.image,
      this.spriteOffsetX + this.spriteX * this.spriteWidth,
      this.spriteOffsetY + this.spriteY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.spriteWidth * 2,
      this.spriteHeight * 2
    );
  }
}
