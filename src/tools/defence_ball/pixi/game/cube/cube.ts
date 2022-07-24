import * as pixi from 'pixi.js';
import { Vector } from '../../../util';
import { Ball } from '../ball';
import { Game } from '../game';

export abstract class Cube {
  pos = Vector.zero;
  abstract object: pixi.DisplayObject;

  move = (v: Vector) => {
    this.pos = this.pos.add(v);
  };

  // return if destroy
  abstract collideBall(ball: Ball, originPos: Vector, game: Game): boolean;
}