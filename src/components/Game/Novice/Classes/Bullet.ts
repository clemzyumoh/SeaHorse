



import { GameContext, Drawable, Updatable } from "../types";
import bull from "../../../../../public/assets/bullet.png";

export class Bullet implements Drawable, Updatable {
  game: GameContext;
  width = 10;
  height = 3;
  x: number;
  img1: HTMLImageElement;

  y: number;
  private speed = 3;
  private maxSpeed = 5;
  markedfordeletion = false;

  constructor(game: GameContext, x: number, y: number) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.img1 = new window.Image();
    this.img1.src = typeof bull === "string" ? bull : bull.src;
  }

  update() {
    this.x += this.speed;
    if (this.x > this.game.width * 0.8) {
      this.markedfordeletion = true;
    }
  }

  draw(context: CanvasRenderingContext2D) {
  context.drawImage(
    this.img1,
    this.x,
    this.y,
  
  );
  }
}
