import { GameContext, Drawable, Updatable } from "../types";
import angle1 from "../../../../../public/assets/angler1.png";
import angle2 from "../../../../../public/assets/angler2.png";
import luck from "../../../../../public/assets/lucky.png";
import hive from "../../../../../public/assets/hivewhale.png";
import drone from "../../../../../public/assets/drone.png";

export class Enemy implements Drawable, Updatable {
  game: GameContext;
  x: number;
  type: string;
  y: number;
  lives: number;
  score: number;
  width: number; // Default lives for the enemy
  height: number;
  img1: HTMLImageElement;
  img2: HTMLImageElement;
  img3: HTMLImageElement;
  img4: HTMLImageElement;
  img5: HTMLImageElement;
  speedX: number;
  frameY: number = 0; // Default frameY for the enemy
  frameX: number = 0; // Default frameX for the enemy
  maxFrame = 37;
  markedfordeletion: boolean = false;
  constructor(game: GameContext) {
    this.game = game;
    this.x = this.game.width; // Start from the right side of the canvas
    this.y = Math.random() * this.game.height; // Random vertical position
    this.markedfordeletion = false;
    this.width = 50;
    this.height = 50;
    this.type = "lucky";
    this.lives = 1; // Default lives for the enemy
    this.score = this.lives; // Score for defeating the enemy
    this.speedX = Math.random() * -2 - 1; // Random speed between 1 and 3
    this.img1 = new window.Image();
    this.img1.src = typeof angle1 === "string" ? angle1 : angle1.src;
    this.img2 = new window.Image();
    this.img2.src = typeof angle2 === "string" ? angle2 : angle2.src;
    this.img3 = new window.Image();
    this.img3.src = typeof luck === "string" ? luck : luck.src;
    this.img4 = new window.Image();
    this.img4.src = typeof hive === "string" ? hive : hive.src;
    this.img5 = new window.Image();
    this.img5.src = typeof drone === "string" ? drone : drone.src;
  }

  update() {
    this.x += this.speedX - this.game.speed; // Move left
    if (this.x + this.width < 0) {
      this.markedfordeletion = true; // Mark for deletion if it goes off screen
    }
    //angler1
    if (this.frameX < this.maxFrame) this.frameX++;
    else {
      this.frameX = 0;
    } // Loop through frames}
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.img1,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (this.game.debug) {
      context.font = "20px Helvetica";
      context.fillText(` ${this.lives}`, this.x, this.y);
    }
  }
}
export class Angler1 extends Enemy {
  
  constructor(game: GameContext) {
    super(game);
    this.y = Math.random() * (this.game.height * 0.95 - this.height);
    this.frameY = Math.floor(Math.random() * 3);
    this.width = 228;
     this.type = "angler1";
    this.height = 169;
    this.lives = 5; // Default lives for the enemy
    this.score = this.lives; // Score for defeating the enemy
    this.img1.src = typeof angle1 === "string" ? angle1 : angle1.src;
  }
}


export class Angler2 extends Enemy {
  //lives: number = 3; // Angler1 has 3 lives
  // Score for defeating Angler1
  constructor(game: GameContext) {
    super(game);
    this.y = Math.random() * (this.game.height * 0.95 - this.height);
    this.frameY = Math.floor(Math.random() * 2);
    this.width = 213;
    this.height = 165;
    this.type = "angler2";
    this.lives = 7; // Default lives for the enemy
    this.score = this.lives; // Score for defeating the enemy

    // this.img2.src = typeof angle1 === "string" ? angle1 : angle1.src;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.img2,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.font = "20px Helvetica";
    context.fillText(` ${this.lives}`, this.x, this.y);
  }
}

export class lucky extends Enemy {
  
  constructor(game: GameContext) {
    super(game);
    this.y = Math.random() * (this.game.height * 0.95 - this.height);
    this.frameY = Math.floor(Math.random() * 2);
    this.width = 99;
    this.height = 95;
    this.lives = 5; 
    this.score = 15; 
    this.type = "lucky";
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.img3,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.font = "20px Helvetica";
    context.fillText(` ${this.lives}`, this.x, this.y);
  }
}

export class Hivewhale extends Enemy {
  
  constructor(game: GameContext) {
    super(game);
    this.y = Math.random() * (this.game.height * 0.95 - this.height);
    this.frameY = 0;
    this.width = 400;
    this.height = 227;
    this.lives = 20; 
    this.score = 15; 
    this.type = "Hivewhale";
    this.speedX = Math.random() * -1.2 - 0.2; 
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.img4,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.font = "20px Helvetica";
    context.fillText(` ${this.lives}`, this.x, this.y);
  }
}
export class Drone extends Enemy {
  
  constructor(game: GameContext, x: number, y: number) {
    super(game);
    this.x = x;
    this.y = y;
    this.frameY = Math.floor(Math.random() * 2);
    this.width = 115;
    this.height = 95;
    this.lives = 3; 
    this.score = 3; 
    this.type = "Drone";
    this.speedX = Math.random() * -4.2 - 0.5; 

    
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.img5,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.font = "20px Helvetica";
    context.fillText(` ${this.lives}`, this.x, this.y);
  }
}