import { Cube } from './cube';
import * as pixi from 'pixi.js';
import * as c from '../constants';
import { autorun, makeObservable } from 'mobx';

export class AddBall extends Cube {

  object: pixi.Container;

  constructor() {
    super();
    makeObservable(this, {
      pos: true,
    });

    this.object = new pixi.Container();

    const circle = new pixi.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(0, 0, c.brickSize / 2);
    circle.endFill();

    const text = new pixi.Text('+1');
    text.anchor.set(0.5);
    text.style.fontSize = c.brickSize / 1.5;

    this.object.addChild(circle, text);

    autorun(() => {
      this.object.position.set(this.pos.x, this.pos.y);
    });
  }
}
