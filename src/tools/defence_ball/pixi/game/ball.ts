import { Vector } from '../../util';
import * as pixi from 'pixi.js';
import { autorun, makeAutoObservable } from 'mobx';

export class Ball {
  radius = 5;
  strength = 1;
  speedValue = 7;
  die: boolean = false;
  center: Vector = Vector.of(-100, -100);
  speed: Vector = Vector.zero;
  wait: number = 0;
  object: pixi.Graphics = new pixi.Graphics();
  beat = 0;

  constructor() {
    makeAutoObservable(this);

    autorun(() => {
      this.object.clear();
      this.object.beginFill(0xffffff);
      this.object.drawCircle(0, 0, this.radius);
    });

    autorun(() => {
      this.object.position.set(this.center.x, this.center.y);
    });
  }

  resetSpeed = (pos: Vector) => {
    this.speed = pos.minus(this.center).normalize(this.speedValue);
  };

}