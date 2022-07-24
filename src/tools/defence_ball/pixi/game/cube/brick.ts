import { Cube } from './cube';

import * as pixi from 'pixi.js';
import { action, autorun, makeObservable } from 'mobx';
import { Ball } from '../ball';
import { Vector } from '../../../util';
import { collideSquareCircle } from '../collide';
import { Game } from '../game';


export class Brick extends Cube {
  object: pixi.Container;
  size = 18;

  constructor(
    public count: number,
  ) {
    super();
    makeObservable(this, {
      count: true,
      pos: true,
      collideBall: action,
    });

    this.object = new pixi.Container();

    const rect = new pixi.Graphics();
    const text = new pixi.Text();
    text.anchor.set(0.5);

    this.object.addChild(rect, text);
    rect.interactive = true;
    rect.on('click', (e: pixi.InteractionEvent) => {
      console.log(e);
    });

    autorun(() => {
      this.object.position.set(this.pos.x, this.pos.y);
    });

    autorun(() => {
      text.text = this.count;
      text.style.fontSize = this.size / Math.max(2, this.count.toString().length) * 2 / 1.5;

      rect.clear();
      rect.beginFill(0xffffff); //TODO color by count
      rect.drawRect(-this.size / 2, -this.size / 2, this.size, this.size);
      rect.endFill();
    });
  }

  collideBall = (ball: Ball, originPos: Vector, game: Game) => {
    const collided = collideSquareCircle(
      this.pos,
      this.size,
      ball.center,
      ball.radius,
    );
    if (collided) {
      this.count -= 1;
      ball.beat += 1;
      game.score += 1;
      const rel = this.pos.minus(originPos);
      if (rel.y > rel.x) {
        if (rel.y > -rel.x) {
          // collide cube top
          ball.center = ball.center.flipY(this.pos.y - this.size / 2 - ball.radius);
          ball.speed = ball.speed.flipY();
        } else {
          // collide cube right
          ball.center = ball.center.flipX(this.pos.x + this.size / 2 + ball.radius);
          ball.speed = ball.speed.flipX();
        }
      } else {
        if (rel.y > -rel.x) {
          // collide cube left
          ball.center = ball.center.flipX(this.pos.x - this.size / 2 - ball.radius);
          ball.speed = ball.speed.flipX();
        } else {
          // collide cube bottom
          ball.center = ball.center.flipY(this.pos.y + this.size / 2 + ball.radius);
          ball.speed = ball.speed.flipY();
        }
      }
    }
    return this.count === 0;
  };
}