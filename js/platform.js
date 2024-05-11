export default class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render(ctx) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.01)"; // transparent
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
