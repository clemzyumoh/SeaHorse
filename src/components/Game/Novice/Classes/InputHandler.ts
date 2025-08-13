import React from "react";
import { GameContext } from "../types";

export class InputHandler {
  constructor(private game: GameContext) {
    this.game = game;
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  

  private handleKeyDown(event: KeyboardEvent) {
    if (this.game.paused || this.game.gameOver) return; // Skip if inactive

    if (
      (event.key === "ArrowUp" || event.key === "ArrowDown") &&
      this.game.keys.indexOf(event.key) === -1
    ) {
      event.preventDefault();
      this.game.keys.push(event.key);
    } else if (event.key === " ") {
      event.preventDefault();
      this.game.player.shootTop(this.game.player.x, this.game.player.y);
    } else if (event.key === "d") {
      this.game.debug = !this.game.debug; // No preventDefault needed
    }
  }

  // private handleKeyUp(event: KeyboardEvent) {
  //   event.preventDefault();
  //   // Handle key up events
  //   if (this.game.keys.indexOf(event.key) > -1) {
  //     this.game.keys.splice(this.game.keys.indexOf(event.key), 1); // Remove key from pressed keys
  //   }
  //   // console.log(this.game.keys);
  // }

  private handleKeyUp(event: KeyboardEvent) {
    if (this.game.paused || this.game.gameOver) return; // Skip if inactive

    const index = this.game.keys.indexOf(event.key);
    if (index > -1) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault(); // Optional, but safe
      }
      this.game.keys.splice(index, 1);
    }
  }

  public touchStart(
    event: TouchEvent | React.TouchEvent,
    key: "ArrowUp" | "ArrowDown"
  ) {
    if (this.game.paused || this.game.gameOver) return;

    event.preventDefault();
    if (!this.game.keys.includes(key)) this.game.keys.push(key);
  }

  public touchEnd(
    event: TouchEvent | React.TouchEvent,
    key: "ArrowUp" | "ArrowDown"
  ) {
    if (this.game.paused || this.game.gameOver) return;

    event.preventDefault();
    const index = this.game.keys.indexOf(key);
    if (index > -1) {
      this.game.keys.splice(index, 1);
    }
  }

  
  public touchShoot = (event: TouchEvent | React.TouchEvent) => {
    if (!this.game || this.game.paused || this.game.gameOver) return;

    event.preventDefault();
    if (this.game.player && this.game.ammo > 0) {
      // Also check ammo
      this.game.player.shootTop(this.game.player.x, this.game.player.y);
      this.game.ammo--; // Decrease ammo
    }
  };

 

  draw(ctx: CanvasRenderingContext2D) {
    // Draw UI elements
  }
}
