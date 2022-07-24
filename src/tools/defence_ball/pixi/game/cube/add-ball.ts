import { Cube } from './cube';
import * as pixi from 'pixi.js';
import { autorun, makeObservable } from 'mobx';
import { Vector } from '../../../util';
import { Ball } from '../ball';
import { collideCircle } from '../collide';
import { Game } from '../game';

export class AddBall extends Cube {

  big: boolean = false;
  object: pixi.Container;
  radius = 8;

  constructor() {
    super();
    makeObservable(this, {
      pos: true,
    });

    this.object = new pixi.Container();

    const circle = new pixi.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(0, 0, this.radius);
    circle.endFill();

    const text = new pixi.Text();
    text.anchor.set(0.5);
    text.style.fontSize = this.radius / 0.75;

    this.object.addChild(circle, text);

    autorun(() => {
      if (this.big) {
        text.text = '+大';
      } else {
        text.text = '+1';
      }
    });

    autorun(() => {
      this.object.position.set(this.pos.x, this.pos.y);
    });
  }

  collideBall = (ball: Ball, _: Vector, game: Game): boolean => {
    const collided = collideCircle(ball.center, ball.radius, this.pos, this.radius);
    if (collided) {
      const b = new Ball();
      if (this.big) {
        b.radius *= 1.7;
        b.strength *= 2;
      }
      game.pendingBalls.push(b);
      return true;
    }
    return false;
  };
}
