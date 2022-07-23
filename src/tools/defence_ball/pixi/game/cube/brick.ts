import { Cube } from './cube';

import * as pixi from 'pixi.js';
import { autorun, makeObservable } from 'mobx';
import * as c from '../constants';
import { brickSize } from '../constants';


export class Brick extends Cube {
  object: pixi.Container;

  constructor(
    public count: number,
  ) {
    super();
    makeObservable(this, {
      count: true,
      pos: true,
    });

    this.object = new pixi.Container();

    const rect = new pixi.Graphics();
    const text = new pixi.Text();
    text.anchor.set(0.5);

    this.object.addChild(rect, text);

    autorun(() => {
      this.object.position.set(this.pos.x, this.pos.y);
    });

    autorun(() => {
      text.text = count;
      text.style.fontSize = c.brickSize / Math.max(2, count.toString().length) * 2 / 1.5;

      rect.clear();
      rect.beginFill(0xffffff); //TODO color by count
      rect.drawRect(-c.brickSize / 2, -c.brickSize / 2, brickSize, brickSize);
      rect.endFill();
    });
  }
}