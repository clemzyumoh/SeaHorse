

import { GameContext, Drawable, Updatable } from "../types";
import { Bullet } from "./Bullet";
import player from "../../../../../public/assets/player.png";
import { Sound } from "./Sound";

export class Player implements Drawable, Updatable {
  game: GameContext;
  width = 120;
  height = 190;
  x = 20;
  y = 100;
  speedY = 0;
  maxSpeed = 5;
  bullet: Bullet[] = [];
  sound: Sound;
  img1: HTMLImageElement;
  frameX = 0;
  frameY = 0;
  maxFrame = 37;
  powerUp: boolean = false;
  powerUpTimer: number = 0;
  powerUpLimit: number = 10000; // 10 seconds

  constructor(game: GameContext, sound: Sound) {
    this.game = game;
    this.img1 = new window.Image();
    this.img1.src = typeof player === "string" ? player : player.src;
    this.sound = sound;
  }

  update(deltaTime: number) {
    if (this.game.keys.includes("ArrowUp")) {
      this.speedY = -this.maxSpeed;
    } else if (this.game.keys.includes("ArrowDown"))
      this.speedY = this.maxSpeed;
    else this.speedY = 0;

    this.y += this.speedY;
    this.bullet.forEach((bullet) => {
      bullet.update();
    });
    this.bullet = this.bullet.filter((bullet) => !bullet.markedfordeletion);

    //spite animation
    if (this.frameX < this.maxFrame) {
      this.frameX++;
    } else {
      this.frameX = 0;
    }
    //vertical boundaries
    if (this.y > this.game.height - this.height * 0.5) {
      this.y = this.game.height - this.height * 0.5;
    } else if (this.y < -this.height * 0.5) {
      this.y = -this.height * 0.5;
    }
    //powerUp
    if (this.powerUp) {
      if (this.powerUpTimer > this.powerUpLimit) {
        this.powerUpTimer = 0; // Assuming 60 FPS

        this.powerUp = false;
        this.frameY = 0; // Reset to normal frame
      } else {
        this.powerUpTimer += deltaTime; // Increment timer
        this.frameY = 1; // Change to power-up frame
        this.game.ammo += 0.1; // Increase ammo
      }
    }
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    this.bullet.forEach((bullet) => {
      bullet.draw(context);
    });
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
  }
  shootTop(x: number, y: number) {
    if (this.game.ammo > 0) {
      this.bullet.push(new Bullet(this.game, x + 80, y + 30));
      this.game.ammo--;
    }
    if (this.powerUp) {
      this.shootBottom(x, y);
      this.sound.playPowerUpShooting(); // Correct method
    } else {
      this.sound.playShooting();
    }
  }
  shootBottom(x: number, y: number) {
    if (this.game.ammo > 0) {
      this.bullet.push(new Bullet(this.game, x + 80, y + 178));
    }
  }

  enterPowerUp() {
    this.powerUp = true;
    this.powerUpTimer = 0;
    this.game.ammo = Math.min(this.game.ammo + 20, this.game.maxAmmo);
    this.frameY = 1;
  }
}
