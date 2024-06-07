export default class Enemy {
  debug = true;

  constructor(x, y, image, sprite_number = 0) {
    this.x = x;
    this.y = y;
    this.orginalX = x;
    this.orginalY = y;
    this.image = image;
    this.sprite_number = sprite_number;

    this.speed = -1;
    this.velocityY = 0;
    this.spriteOffsetX = 12;
    this.spriteOffsetY = 20;
    this.width = 18;
    this.height = 18;

    // distance between sprites
    this.spriteWidth = 30;
    this.spriteHeight = 30;

    // select a sprite from the sprite sheet
    switch (this.sprite_number) {
      case 0: // Fly
        this.spriteX = 4;
        this.spriteY = 2;
        break;
      case 1:
        this.spriteX = 2;
        this.spriteY = 2;
        break;
      case 2:
        this.spriteX = 0;
        this.spriteY = 2;
        break;
      case 3: // Hedgehog
        this.spriteX = 0;
        this.spriteY = 9;
        this.spriteOffsetX = 14;
        this.spriteOffsetY = 8;
        this.width = 16;
        this.height = 15;
        this.velocityY = -0.15;
        break;
      default:
        this.spriteX = 4;
        this.spriteY = 2;
        break;
    }
  }

  update() {
    this.x += this.speed;
    this.y += this.velocityY;

    // move enemy to the right again, random distance from canvas and speed
    if (this.x < -this.width) {
      this.x = (Math.random() + 1) * this.orginalX;
      this.speed = -(Math.random() + 0.5);
      this.y = this.orginalY;
    }
  }

  render(ctx) {
    // Render enemy on canvas
    // 9 argument command (image, sx, sy, sw, sh, dx, dy, dw, dh)  -> s= source, d= destination
    ctx.drawImage(
      this.image,
      this.spriteOffsetX + this.spriteX * this.spriteWidth,
      this.spriteOffsetY + this.spriteY * this.spriteHeight,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width * 2,
      this.height * 2
    );

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
  }
}
