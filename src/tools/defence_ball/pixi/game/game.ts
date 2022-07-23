import { Cube } from './cube/cube';
import { Ball } from './ball';
import { makeAutoObservable, observable } from 'mobx';
import { Vector } from '../../util';
import { randomFloat, randomInt, randomSub } from '../../../../../common/util/random';
import { range } from '../../../../../common/util/array';
import * as c from './constants';
import { topPadding } from './constants';
import { Brick } from './cube/brick';
import { AddBall } from './cube/add-ball';
import * as pixi from 'pixi.js';

export class Game {
  state: 'ready' | 'waiting' | 'running' | 'over' = 'ready';
  level: number = 0;
  totalBallCount: number = 1;
  ballCount: number = 1;
  balls: Ball[] = [];
  cubes: Cube[] = [];
  object = new pixi.Container();
  cubeContainer = new pixi.Container();
  ballContainer = new pixi.Container();

  constructor() {
    makeAutoObservable(this, {
      balls: observable.shallow,
    });

    this.object.addChild(this.cubeContainer, this.ballContainer);

  }

  newGame = () => {
    this.state = 'waiting';
    this.level = 0;
    this.ballCount = 1;
    this.totalBallCount = 1;
    this.cubes.length = 0;
    this.balls.length = 0;
    this.resetBall();
    this.addCubeRow();
    this.addCubeRow();
    this.addCubeRow();
  };

  addCubeRow = () => {
    const newCubes: Cube[] = randomSub(range(c.cubeCountPerRow), randomInt(c.cubeCountPerRow * 0.4, c.cubeCountPerRow * 0.9)).map((x) => {
      let cube;
      if (randomFloat(10) < 1 / Math.sqrt(this.totalBallCount)) {
        cube = new AddBall();
        this.totalBallCount += 1;
      } else {
        let count = Math.ceil(this.level * randomFloat(0.5, 0.8));
        if (randomFloat() < 0.1) {
          count += Math.ceil(this.level * 0.5 + this.ballCount);
        }
        cube = new Brick(count);
      }
      cube.pos = Vector.of((x + 0.5) * c.cubeSize, topPadding + c.cubeSize / 2);
      return cube;
    });
    this.cubes.forEach(e => e.move(Vector.of(0, c.cubeSize)));
    this.cubes.push(...newCubes);
    this.cubeContainer.addChild(...newCubes.map(e => e.object));
  };

  resetBall = () => {
    while (this.balls.length < this.ballCount) {
      const ball = new Ball();
      this.balls.push(ball);
      this.ballContainer.addChild(ball.object);
    }
    const startX = randomFloat(0.1, 0.9) * c.width;
    this.balls.forEach((e, i) => {
      e.die = false;
      e.wait = i * 100;
      e.center = Vector.of(startX, c.bottomY);
      e.speed = Vector.zero;
    });
  };
}