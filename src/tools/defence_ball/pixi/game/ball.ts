import { Vector } from '../../util';
import * as pixi from 'pixi.js';
import * as c from './constants';
import { autorun, makeAutoObservable } from 'mobx';

export class Ball {
  die: boolean = false;
  center: Vector = Vector.of(-100, -100);
  speed: Vector = Vector.zero;
  wait: number = 0;
  object: pixi.Graphics = new pixi.Graphics();

  constructor() {
    makeAutoObservable(this);
    this.object.beginFill(0xffffff);
    this.object.drawCircle(0, 0, c.ballRadius);

    autorun(() => {
      this.object.position.set(this.center.x, this.center.y);
    });
  }
}