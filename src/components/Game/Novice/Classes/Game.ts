import { InputHandler } from "./InputHandler";
import { Player } from "./Player";
import { Background } from "./Background";
import { UI } from "./UI";
import { Bullet } from "./Bullet";
import { Drone, Enemy } from "./Enemy";
import { Angler1 } from "./Enemy";
import { Angler2 } from "./Enemy";
import { lucky } from "./Enemy";
import { Hivewhale } from "./Enemy";

import { Particle } from "./Particle";
import { Explosion } from "./Explosion";
import { Smoke } from "./Explosion";
import { Fire } from "./Explosion";
import { Sound } from "./Sound";
import { levelConfigs } from "../types/level";
export default class Game {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  input: InputHandler;
  player: Player;
  enemy: Enemy;
  paused: boolean = true;
  background: Background;
  bullet: Bullet;
  ui: UI;
  

  sound: Sound;
  keys: string[];
  enemies: Enemy[];
  ammo: number;

  score: number;
  // maxAmmo: number;
  ammoTimer: number;
  ammoInterval: number;
  enemyTimer: number;
  //  enemyInterval: number;
  gameOver: boolean = false;
  // XPscore: number;
  gameTime: number;
  //  timeLimit: number;
  maxAmmo!: number;
  enemyInterval!: number;
  XPscore!: number;
  timeLimit!: number;
  speed!: number;
  lastTime: number = 0;

  // speed: number = 1;
  debug: boolean = false;
  particles: Particle[] = [];
  particleTimer: number = 0;
  explosions: Explosion[] = [];
  

  private _gameEndCallbacks: (() => void)[] = [];
  onReset: (() => void) | undefined;

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    
    level: keyof typeof levelConfigs
    
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.input = new InputHandler(this);
    this.sound = new Sound();
    //this.sound.playBackground();
    this.player = new Player(this, this.sound);
    this.enemy = new Enemy(this);
    this.background = new Background(this);

    this.ui = new UI(this, this.sound);
    this.bullet = new Bullet(this, 50, 50);
    this.keys = [];
    this.ammo = 20;
    this.ammoTimer = 0;
    this.ammoInterval = 500;

    // this.maxAmmo = 50;
    this.enemies = [];
    this.enemyTimer = 0;
    //  this.enemyInterval = 2000;
    // this.lastTime =
    this.gameOver;
    // this.paused = false;
    this.score = 0;
    // this.XPscore = 1000;
    this.gameTime = 0;
    // this.timeLimit = 300000;
    this.debug = false;
    this.particles = [];
    this.particleTimer = 0;
    this.explosions = [];
    this.applyLevelConfig(level);
  }

  applyLevelConfig(levelKey: keyof typeof levelConfigs) {
    const config = levelConfigs[levelKey];
    if (!config) {
      throw new Error(
        `Level config "${levelKey}" is undefined. Check if level was set correctly.`
      );
    }
    this.maxAmmo = config.maxAmmo;
    this.enemyInterval = config.enemyInterval;
    this.XPscore = config.XPscore;
    this.timeLimit = config.timeLimit;
    this.speed = config.speed;
  }

  // Add this method
  onGameEnd(callback: () => void) {
    this._gameEndCallbacks.push(callback);
    return () => {
      this._gameEndCallbacks = this._gameEndCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  update(deltaTime: number) {
    if (!this.gameOver && this.score >= this.XPscore) {
      this._gameEndCallbacks.forEach((cb) => cb()); // ← Fire callback FIRST
      this.gameOver = true; // ← Then set flag
      this.sound.stopBackground();
      this.sound.playYouWin();
      return;
    }
    if (this.paused || this.gameOver) return; 

    this.gameTime += deltaTime;


    if (this.gameTime >= this.timeLimit) {
      this._gameEndCallbacks.forEach((cb) => cb());
      this.gameOver = true;
      this.sound.stopBackground();
      this.sound.playGameOver();
    }

   
    this.sound.background;

    this.background.update();
    this.background.layer4.update();
    this.player.update(deltaTime);
    if (this.ammoTimer > this.ammoInterval) {
      if (this.ammo < this.maxAmmo) this.ammo++;
      this.ammoTimer = 0;
    } else {
      this.ammoTimer += deltaTime;
    }
    this.particles.forEach((particle) => {
      particle.update();
    });
    this.explosions.forEach((explosion) => {
      explosion.update(deltaTime);
    });
    this.explosions = this.explosions.filter(
      (explosion) => !explosion.markedfordeletion
    );
    this.particles = this.particles.filter(
      (particle) => !particle.markedfordeletion
    );
    this.enemies.forEach((enemy) => {
      enemy.update();
      if (this.checkCollision(this.player, enemy)) {
        enemy.markedfordeletion = true;
        this.addExplosion(enemy);
        for (let i = 0; i < enemy.score; i++) {
          this.particles.push(
            new Particle(
              this,
              enemy.x + enemy.width * 0.5,
              enemy.y + enemy.height * 0.5
            )
          );
        }
        if (enemy.type === "lucky") {
          this.player.enterPowerUp();
        } else if (!this.gameOver) this.score -=5;
      }
      this.player.bullet.forEach((bullet) => {
        if (this.checkCollision(bullet, enemy)) {
          enemy.lives--;
          bullet.markedfordeletion = true;
          this.particles.push(
            new Particle(
              this,
              enemy.x + enemy.width * 0.5,
              enemy.y + enemy.height * 0.5
            )
          );
          if (enemy.lives <= 0) {
            for (let i = 0; i < enemy.score; i++) {
              this.particles.push(
                new Particle(
                  this,
                  enemy.x + enemy.width * 0.5,
                  enemy.y + enemy.height * 0.5
                )
              );
            }
            enemy.markedfordeletion = true;
            this.addExplosion(enemy);

            if (enemy.type === "Hivewhale") {
              for (let i = 0; i < 5; i++) {
                this.enemies.push(
                  new Drone(
                    this,
                    enemy.x + Math.random() * enemy.width,
                    enemy.y + Math.random() * enemy.height * 0.5
                  )
                );
              }
            }

            if (!this.gameOver) this.score += enemy.score;
            if (this.score >= this.XPscore) {
              this.gameOver = true;
              this._gameEndCallbacks.forEach((cb) => cb()); //win
              this.sound.stopBackground();
              this.sound.playYouWin();
            }
          }
        }
      });
    });
    this.enemies = this.enemies.filter((enemy) => !enemy.markedfordeletion);
    if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "black";
    this.background.draw(this.ctx);

    this.player.draw(this.ctx);

    this.particles.forEach((particle) => {
      particle.draw(this.ctx);
    });
    this.enemies.forEach((enemy) => {
      enemy.draw(this.ctx);
    });
    this.ui.draw(this.ctx);

    this.explosions.forEach((explosion) => {
      explosion.draw(this.ctx);
    });
    this.background.layer4.draw(this.ctx);
 
  }
  addEnemy() {
    const randomisedEnemy = Math.random();
    if (randomisedEnemy < 0.3) {
      this.enemies.push(new Angler1(this));
    } else if (randomisedEnemy < 0.6) {
      this.enemies.push(new Angler2(this));
    } else if (randomisedEnemy < 0.7) {
      this.enemies.push(new Hivewhale(this));
    } else {
      this.enemies.push(new lucky(this));
    }

  }
  addExplosion(enemy: any) {
    const randomised = Math.random();
    if (randomised < 0.5) {
      this.explosions.push(
        new Smoke(
          this,
          enemy.x + enemy.width * 0.5,
          enemy.y + enemy.height * 0.5
        )
      );
      this.sound.explosivesound();
    } else {
      this.explosions.push(
        new Fire(
          this,
          enemy.x + enemy.width * 0.5,
          enemy.y + enemy.height * 0.5
        )
      );
      this.sound.explosivesound();
    }
  }
  checkCollision(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  
  pause() {
    this.paused = true;
    this.sound.background.pause();
  }

 
  resume() {
    this.paused = false;
    this.gameOver = false; 
    this.lastTime = performance.now(); 
    if (!this.sound.muted) {
      this.sound.background.play();
    }
  }

  reset() {
    this._gameEndCallbacks = [];
    this.enemies = [];
    this.ammo = 20;
    this.gameOver = false;
    this.paused = true;
    this.score = 0;
    this.gameTime = 0; 
    this.enemyTimer = 0;
    this.ammoTimer = 0;
    this.player.x = 20;
    this.player.y = 100;
    this.player.speedY = 0;
    this.particles = [];
    this.explosions = [];
    this.sound.stopBackground();
    this.onReset?.(); 
  }
}
