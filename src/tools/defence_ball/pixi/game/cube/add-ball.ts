import { Cube } from './cube';
import * as pixi from 'pixi.js';
import { autorun, makeObservable } from 'mobx';
import { Vector } from '../../../util';
import { Ball } from '../ball';
import { collideCircle } from '../collide';
import { Game } from '../game';

export class AddBall extends Cube {

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

    const text = new pixi.Text('+1');
    text.anchor.set(0.5);
    text.style.fontSize = this.radius / 0.75;

    this.object.addChild(circle, text);

    autorun(() => {
      this.object.position.set(this.pos.x, this.pos.y);
    });
  }

  collideBall = (ball: Ball, _: Vector, game: Game): boolean => {
    const collided = collideCircle(ball.center, ball.radius, this.pos, this.radius);
    if (collided) {
      game.pendingBalls.push(new Ball());
      return true;
    }
    return false;
  };
}
