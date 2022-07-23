import { Cube } from './cube';
import * as pixi from 'pixi.js';
import * as c from '../constants';

export class AddBall extends Cube {

  object: pixi.Container;

  constructor() {
    super();

    this.object = new pixi.Container();

    const circle = new pixi.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(0, 0, c.brickSize / 2);
    circle.endFill();

    const text = new pixi.Text('+1');
    text.anchor.set(0.5);

    this.object.addChild(circle, text);
  }
}
