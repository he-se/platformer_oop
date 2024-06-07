import Coin from "./coin.js";

export default class Brick {
  constructor(x, y, width, height, color, value, coinImage) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.value = value;
    this.coinImage = coinImage;
    this.coin = new Coin(this.x, this.y - 70, this.coinImage);
    this.used = false; // can be hit only once
    this.hit = false;
    this.counted = false;
  }

  onHit() {
    this.hit = true;
    // Set an interval to change this.used to true after 2 seconds
    setInterval(() => {
      this.used = true;
    }, 2000);
  }

  score() {
    if (this.hit && !this.counted) {
      this.counted = true;
      return this.value; // Score for hitting a brick
    }
    return 0;
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.hit && !this.used) this.coin.render(ctx);
  }
}
