
// types/index.ts
import { number } from "framer-motion";
import { Bullet } from "../Classes/Bullet";
import { Player } from "../Classes/Player";
import { levelConfigs } from "./level";
export interface Vector2 {
  x: number;
  y: number;
}

export interface Drawable {
  draw(context: CanvasRenderingContext2D): void;
}

export interface Updatable {
  update(deltaTime?: number): void;
}

// Extend this interface if more game-wide context is needed
export interface GameContext {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  keys: string[];
  bullet: Bullet | null;
  player: Player;
  ammo: number;
  maxAmmo: number;

  //powerupAmmo: number;
  score: number;
  gameOver: boolean;
  XPscore: number;
  gameTime: number;
  timeLimit: number;
  speed: number;
  enemies: any[]; // Replace with actual enemy type if available
  debug: boolean;
  paused: boolean ;

  // level: keyof typeof levelConfigs = "level1"
  // level: keyof typeof levelConfigs;
}
