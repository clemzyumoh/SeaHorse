import { GameContext, Drawable, Updatable } from "../types";
import fire from "../../../../../public/assets/fireExplosion.png";
import smoke from "../../../../../public/assets/smokeExplosion.png";

export class Explosion implements Drawable, Updatable {
  game: GameContext;

  x: number = 0;
  y: number = 0;
  frameX: number = 0;
  img1: HTMLImageElement;
  img2: HTMLImageElement;
  //frameY: number = Math.floor(Math.random() * 3);
  spirietHeight: number = 200;
  timer: number = 0;
  interval: number;
  fps: number;
  markedfordeletion: boolean = false;
  maxFrame: number;
  spiritewidth: number;
  width: number;
  height: number;
  constructor(game: GameContext, x: number, y: number) {
    this.game = game;

    this.frameX = 0;
    // this.frameY = Math.floor(Math.random() * 3);
    this.spirietHeight = 200;
    this.fps = 30;
    this.timer = 0;
    this.interval = 1000 / this.fps;
    this.markedfordeletion = false;
    this.img1 = new window.Image();
    this.img1.src = typeof smoke === "string" ? smoke : smoke.src;
    this.img2 = new window.Image();
    this.img2.src = typeof fire === "string" ? fire : fire.src;
    this.maxFrame = 8;

    this.spiritewidth = 200;
    this.width = this.spiritewidth;
    this.height = this.spirietHeight;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
  }

  update(deltaTime: number) {
    this.x -= this.game.speed;
    if (this.timer > this.interval) {
      this.frameX++;
      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }

    if (this.frameX > this.maxFrame) {
      this.markedfordeletion = true;
    }
  }

  draw(context: CanvasRenderingContext2D) {
  
  }
}
export class Smoke extends Explosion {
  

  constructor(game: GameContext, x: number, y: number) {
    super(game, x, y);
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.img1,
      this.frameX * this.spiritewidth,
      0,
      this.spiritewidth,
      this.spirietHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
export class Fire extends Explosion {
  

  constructor(game: GameContext, x: number, y: number) {
    super(game, x, y);
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.img2,
      this.frameX * this.spiritewidth,
      0,
      this.spiritewidth,
      this.spirietHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
