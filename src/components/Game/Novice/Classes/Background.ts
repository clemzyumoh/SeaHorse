


import { GameContext, Drawable, Updatable } from "../types";
import image1Src from "../../../../../public/assets/layer1.png";
import image2Src from "../../../../../public/assets/layer2.png";
import image3Src from "../../../../../public/assets/layer3.png";
import image4Src from "../../../../../public/assets/layer4.png";
import { Layer } from "./Layer";

export class Background implements Drawable, Updatable {
  game: GameContext;
  layer1: Layer;
  layer2: Layer;
  layer3: Layer;
  layer4: Layer;
  layers: Layer[] = [];
  constructor(game: GameContext) {
    this.game = game;

    // Create an HTMLImageElement and set its src
    const img1 = new window.Image();
    img1.src = typeof image1Src === "string" ? image1Src : image1Src.src;
    const img2 = new window.Image();
    img2.src = typeof image2Src === "string" ? image2Src : image2Src.src;
    const img3 = new window.Image();
    img3.src = typeof image3Src === "string" ? image3Src : image3Src.src;
    const img4 = new window.Image();
    img4.src = typeof image4Src === "string" ? image4Src : image4Src.src;

    this.layer1 = new Layer(game, 0.2, img1);
    this.layer2 = new Layer(game, 0.4, img2);
    this.layer3 = new Layer(game, 1, img3);
    this.layer4 = new Layer(game, 1.5, img4);
    this.layers = [this.layer1, this.layer2, this.layer3];
  }

  update() {
    this.layers.forEach((layer) => layer.update());
  }

  draw(context: CanvasRenderingContext2D) {
    this.layers.forEach((layer) => layer.draw(context));
  }
}
