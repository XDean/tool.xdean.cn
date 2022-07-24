import { Cube } from './cube/cube';
import { Ball } from './ball';
import { autorun, makeAutoObservable, observable } from 'mobx';
import { Vector } from '../../util';
import { randomFloat, randomInt, randomSub } from '../../../../../common/util/random';
import { range } from '../../../../../common/util/array';
import * as c from './constants';
import { topPadding } from './constants';
import { Brick } from './cube/brick';
import { AddBall } from './cube/add-ball';
import * as pixi from 'pixi.js';
import { AuxLine } from './auxLine';

export class Game {
  state: 'ready' | 'waiting' | 'running' | 'over' = 'ready';
  level: number = 0;
  totalBallCount: number = 1; // include not collected
  pendingBalls: Ball[] = [];
  balls: Ball[] = [];
  cubes: (Cube | null)[][] = [];
  cubeContainer = new pixi.Container();
  ballContainer = new pixi.Container();
  auxLine = new AuxLine();
  score = 0;

  constructor() {
    makeAutoObservable(this, {
      balls: observable.shallow,
    });

    autorun(() => {
      this.auxLine.object.visible = this.state === 'waiting';
    });
  }

  init = (app: pixi.Application) => {
    app.stage.addChild(this.cubeContainer, this.ballContainer, this.auxLine.object);
    app.stage.interactive = true;
    app.stage.hitArea = new pixi.Rectangle(0, 0, c.width, c.height);
    app.stage.on('pointermove', (e: pixi.InteractionEvent) => {
      if (this.state === 'waiting') {
        this.auxLine.end = Vector.of(e.data.global.x, e.data.global.y);
      }
    });
    app.stage.on('click', (e: pixi.InteractionEvent) => {
      if (this.state === 'waiting') {
        this.sendBall(Vector.of(e.data.global.x, e.data.global.y));
      }
    });
    app.ticker.add(this.onTick);

    return () => {
    };
  };

  newGame = () => {
    this.state = 'waiting';
    this.score = 0;
    this.level = 1;
    this.totalBallCount = 1;
    this.cubeContainer.removeChildren().forEach(e => e.destroy());
    this.cubes.length = 0;
    this.ballContainer.removeChildren().forEach(e => e.destroy());
    this.balls.length = 0;
    this.pendingBalls.push(new Ball());
    this.resetBall();
    this.addCubeRow();
    this.addCubeRow();
    this.addCubeRow();
  };

  newLevel = () => {
    this.state = 'waiting';
    this.level += 1;
    this.resetBall();
    this.addCubeRow();
    while (this.cubes[this.cubes.length - 1].every(e => e === null)) {
      this.cubes.splice(this.cubes.length - 1, 1);
    }
    if (this.cubes.length > c.maxCubeRows) {
      this.state = 'over';
    }
  };

  addCubeRow = () => {
    const newCubes: (Cube | null)[] = new Array(c.cubeCountPerRow).fill(null);
    randomSub(range(c.cubeCountPerRow), randomInt(c.cubeCountPerRow * 0.4, c.cubeCountPerRow * 0.9)).forEach((x) => {
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
      newCubes[x] = cube;
    });
    this.cubes.forEach(cs => cs.forEach(e => e?.move(Vector.of(0, c.cubeSize))));
    this.cubes.unshift(newCubes);
    this.cubeContainer.addChild(...newCubes.filter(e => !!e).map(e => e!.object));
  };

  resetBall = () => {
    this.pendingBalls.forEach(ball => {
      this.balls.push(ball);
      this.ballContainer.addChild(ball.object);
    });
    this.pendingBalls.length = 0;
    const startX = randomFloat(0.1, 0.9) * c.width;
    this.auxLine.start = Vector.of(startX, c.bottomY);
    this.balls.forEach((e, i) => {
      e.die = false;
      e.wait = i * 5;
      e.center = Vector.of(startX, c.bottomY);
      e.speed = Vector.zero;
    });
  };

  sendBall = (v: Vector) => {
    this.state = 'running';
    this.balls.forEach(b => b.resetSpeed(v));
  };

  onTick = (frame: number) => {
    if (this.state === 'running') {
      if (this.balls.every(e => e.die)) {
        this.newLevel();
      }
      this.balls
        .filter(e => !e.die && e.wait < frame)
        .forEach((b) => {
          const originPos = b.center;
          b.center = b.center.add(b.speed.multi(frame - b.wait));

          // world collide
          if (b.center.x < b.radius) {
            b.center = b.center.flipX(b.radius);
            b.speed = b.speed.flipX();
          } else if (b.center.x > c.width - b.radius) {
            b.center = b.center.flipX(c.width - b.radius);
            b.speed = b.speed.flipX();
          }
          if (b.center.y < b.radius) {
            b.center = b.center.flipY(b.radius);
            b.speed = b.speed.flipY();
          } else if (b.center.y > c.bottomY) {
            // ball die
            b.center = b.center.withY(c.bottomY);
            b.speed = Vector.zero;
            b.die = true;
            return;
          }

          // cube collide
          const cellX = Math.floor(b.center.x / c.cubeSize);
          const cellY = Math.floor((b.center.y - topPadding) / c.cubeSize);
          [4, 1, 3, 5, 7, 0, 2, 6, 8]
            .map(e => [(cellX + Math.floor(e / 3) - 1), (cellY + e % 3 - 1)] as const)
            .forEach(([x, y]) => {
              const cube = this.getCube(x, y);
              if (cube) {
                const destroy = cube.collideBall(b, originPos, this);
                if (destroy) {
                  this.cubes[y][x] = null;
                  this.cubeContainer.removeChild(cube.object);
                  cube.object.destroy();
                }
              }
            });
        });
      this.balls.forEach(e => e.wait = Math.max(0, e.wait - frame));
    }
  };

  getCube = (x: number, y: number): Cube | null => {
    if (y >= 0 && y < this.cubes.length && x >= 0 && x < c.cubeCountPerRow) {
      return this.cubes[y][x] ?? null;
    }
    return null;
  };

  get ballCount() {
    return this.balls.length + this.pendingBalls.length;
  }

  stopLevel() {
    if (this.state === 'running') {
      this.balls.forEach(b => {
        b.center = b.center.withY(c.bottomY);
        b.speed = Vector.zero;
        b.die = true;
      });
      this.newLevel();
    }
  }
}