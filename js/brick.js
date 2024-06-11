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
    this.state = 0; // states are: initial = 0, hit = 1, used = 2, counted = 3 Note:JS doesn't support enum
  }

  getState() {
    return this.state;
  }

  onHit() {
    if (this.state === 0) {
      this.state = 1;
      // Set an timeout to change state to used after 2 seconds
      setTimeout(() => {
        this.state = 2;
      }, 2000);
    }
  }

  score() {
    if (this.state === 2) {
      this.state = 3;
      return this.value; // Score for hitting a brick
    }
    return 0;
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.state === 1) this.coin.render(ctx);
  }
}
