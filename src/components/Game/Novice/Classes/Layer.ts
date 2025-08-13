



import { GameContext, Drawable, Updatable } from "../types";



export class Layer implements Drawable, Updatable {
  game: GameContext;
  image: HTMLImageElement;
  speedModifier: number = 1;
  width = 1768;
  height = 500;
  x: number = 0;
  y: number = 0;
  constructor(
    game: GameContext,
    speedModifier: number = 1,
    image: HTMLImageElement
  ) {
    this.game = game;
    this.image = image;
    this.speedModifier = speedModifier;
  }
  update() {
    this.x -= this.speedModifier; // Move left
    if (this.x <= -this.image.width) this.x = 0; // Loop background
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.x, 0);
    context.drawImage(this.image, this.x + this.image.width, 0); // For seamless loop
  }

  
}
