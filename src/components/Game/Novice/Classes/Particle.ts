import { GameContext, Drawable, Updatable } from "../types";
import gear from "../../../../../public/assets/gears.png";

export class Particle implements Drawable, Updatable {
  private game: GameContext;
  img1: HTMLImageElement;

  x: number = 0;
  y: number = 0;
  frameX: number = Math.floor(Math.random() * 3);
  frameY: number = Math.floor(Math.random() * 3);
  spirietSize: number = 50;
  sizeModifier: number = parseFloat((Math.random() * 0.5 + 0.5).toFixed(1)); 
  size: number = this.spirietSize * this.sizeModifier;
  speedX: number = Math.random() * 6 - 3; 
  speedY: number = Math.random() * 2 - 1; 
  gravity: number = 0.5; 
  markedfordeletion: boolean = false;
  angle: number = 0; 
  valocity: number = Math.random() * 0.2 - 0.1; 
  bounced: number = 0; 
  bottomBounced: number = 100;

  constructor(game: GameContext, x: number, y: number) {
    this.game = game;
    this.img1 = new window.Image();
    this.img1.src = typeof gear === "string" ? gear : gear.src;
    this.x = x; 
    this.y = y; 
    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 3);
    this.spirietSize = 50;
    this.sizeModifier = parseFloat((Math.random() * 0.5 + 0.5).toFixed(1)); 
    this.size = this.spirietSize * this.sizeModifier;
    this.speedX = Math.random() * 6 - 3; 
    this.speedY = Math.random() * -15;
    this.gravity = 0.5; 
    this.markedfordeletion = false;
    this.angle = 0; 
    this.valocity = Math.random() * 0.2 - 0.1; 
    this.bounced = 0; 
    this.bottomBounced = Math.random() * 80 + 60; 
  }

  update() {
    this.angle += this.valocity;
    this.speedY += this.gravity; 
    this.x -= this.speedX + this.game.speed; 
    this.y += this.speedY; 
    if (this.y > this.game.height + this.size || this.x < -this.size) {
      this.markedfordeletion = true;
    }
    if (this.y > this.game.height - this.bottomBounced && this.bounced < 2) {
      this.speedY *= -0.9; 
      this.bounced++; 
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(
      this.img1,
      this.frameX * this.spirietSize,
      this.frameY * this.spirietSize,
      this.spirietSize,
      this.spirietSize,
      this.size * -0.5,
      this.size * -0.5,
      this.size,
      this.size
    );
    context.restore();
  }
}
