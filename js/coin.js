export default class Coin {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;

    this.width = 40;
    this.height = 60;

    this.isVisible = false;
    this.isUsed = false;
  }

  update(canvas) {}

  render(ctx) {
    // Render image on canvas
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
