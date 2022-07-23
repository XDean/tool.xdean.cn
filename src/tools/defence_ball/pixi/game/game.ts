import { Cube } from './cube/cube';
import { Ball } from './ball';
import { autorun, makeAutoObservable, observable } from 'mobx';
import { Vector } from '../../util';
import { randomFloat, randomInt, randomSub } from '../../../../../common/util/random';
import { range } from '../../../../../common/util/array';
import * as c from './constants';
import { Brick } from './cube/brick';
import { AddBall } from './cube/add-ball';
import * as pixi from 'pixi.js';

export class Game {
  state: 'waiting' | 'running' | 'over' = 'waiting';
  level: number = 0;
  cubes: (Cube | null)[][] = [];
  balls: Ball[] = [];
  object: pixi.Container = new pixi.Container();

  constructor() {
    makeAutoObservable(this, {
      balls: observable.shallow,
    });

    autorun(() => {
      this.object.removeChildren();
      console.log(this.balls);
      if (this.balls.length > 0) {
        this.object.addChild(...this.balls.map(e => e.object));
      }
    });
  }

  get ballCount() {
    return this.balls.length;
  }

  newGame = () => {
    this.state = 'waiting';
    this.level = 0;
    this.cubes.length = 0;
    this.balls.length = 0;
    this.balls.push(new Ball());
  };

  newLevel = () => {
    this.state = 'waiting';
    this.level += 1;
    const newCubes: Cube[] = [];
    randomSub(range(c.cubeCountPerRow), randomInt(c.cubeCountPerRow * 0.4, c.cubeCountPerRow * 0.9)).forEach(() => {
      let count = Math.ceil(this.level * randomFloat(0.5, 0.8));
      if (randomFloat() < 0.1) {
        count += Math.ceil(this.level * 0.5 + this.ballCount);
      }
      newCubes.push(new Brick(count));
    });
    if (randomFloat() < 0.1 + 1 / Math.sqrt(this.level)) {
      const idx = randomInt(newCubes.length);
      newCubes[idx] = new AddBall();
    }
    this.cubes.unshift(newCubes);

    const startX = randomFloat(0.1, 0.9) * c.width;
    this.balls.forEach((e, i) => {
      e.die = false;
      e.wait = i * 100;
      e.center = Vector.of(startX, c.bottomY);
      e.speed = Vector.zero;
    });
  };
}