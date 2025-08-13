import { GameContext, Drawable } from "../types";
import { Sound } from "./Sound";
// Classes/UI.ts


export class UI implements Drawable {
  private game: GameContext;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  sound: Sound;

  constructor(game: GameContext,  sound:Sound
  ) {
    this.game = game;
    this.fontSize = 16;
    this.fontFamily = "Bangers";
    this.fontColor = "white";
    this.sound = sound
  }

  draw(context: CanvasRenderingContext2D) {
    //\
    context.save();
    context.fillStyle = this.fontColor;
    context.fillText(`Score: ${this.game.score}`, 20, 40);
    //context.fillText(`XPScore: ${this.game.XPscore}`, 10, 40);
    const formattedTimer = (this.game.gameTime * 0.001).toFixed(1);
    context.fillText(`Timer: ${formattedTimer}`, 20, 100);
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowColor = "black";

    //ammo
    if (this.game.player.powerUp) context.fillStyle = "yellow";

    for (let i = 0; i < this.game.ammo; i++) {
      context.fillRect(20 + 5 * i, 50, 3, 20);
      // context.font = `${this.fontSize}px ${this.fontFamily}`;
      // context.fillText("•", 10 + i * 20, 20);
    }

    //gameover
    if (this.game.gameOver) {
      context.textAlign = "center";
      context.fillStyle = "black";
     const gameOverText = "Game Over";
    // const finalScoreText = `Final Score: ${this.game.score}`;
     const tryAgainText = "try again";
     const wellDoneText = "Well Done!";
     const youwinText = "You Win!";

      // if (this.game.score >= this.game.XPscore) {
      //   context.font = `80px ${this.fontFamily}`;
      //   context.fillText(
      //     youwinText,
      //     this.game.width * 0.5,
      //     this.game.height * 0.5
      //   );
      //   this.sound.youWin
      //   context.font = `40px ${this.fontFamily}`;
      //   context.fillText(
      //     wellDoneText,
      //     this.game.width * 0.5,
      //     this.game.height * 0.5 + 40
      //   );
      // } else {
      //   context.font = `70px ${this.fontFamily}`;
      //   context.fillText(
      //     gameOverText,
      //     this.game.width * 0.5,
      //     this.game.height * 0.5
      //   );
      //   this.sound.gameOver
      //   context.font = `40px ${this.fontFamily}`;
      //   context.fillText(
      //     tryAgainText,
      //     this.game.width * 0.5,
      //     this.game.height * 0.5 + 40
      //   );
      // }

      if (this.game.score >= this.game.XPscore) {
        context.font = `80px ${this.fontFamily}`;
        context.fillText(
          youwinText,
          this.game.width * 0.5,
          this.game.height * 0.5
        );
        this.sound.youWin.play(); // <-- call the function/method
        context.font = `40px ${this.fontFamily}`;
        context.fillText(
          wellDoneText,
          this.game.width * 0.5,
          this.game.height * 0.5 + 40
        );
      } else {
        context.font = `70px ${this.fontFamily}`;
        context.fillText(
          gameOverText,
          this.game.width * 0.5,
          this.game.height * 0.5
        );
        this.sound.gameOver.play(); // <-- call the function/method
        context.font = `40px ${this.fontFamily}`;
        context.fillText(
          tryAgainText,
          this.game.width * 0.5,
          this.game.height * 0.5 + 40
        );
      }

    }
    context.restore();
  }
}
