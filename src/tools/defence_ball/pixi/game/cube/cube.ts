import * as pixi from 'pixi.js';
import { Vector } from '../../../util';

export abstract class Cube {
  pos = Vector.zero;
  abstract object: pixi.DisplayObject;

  tick(_millis: number): void {

  }

  move = (v: Vector) => {
    this.pos = this.pos.add(v);
  };
}