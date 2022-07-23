import * as d3 from 'd3';
import { range } from '../../../../common/util/array';
import { randomFloat, randomInt, randomSub } from '../../../../common/util/random';
import { caseNever } from '../../../../common/util/base';
import { flip, Vector } from '../util';


type Cube = ({
  type: 'cube'
  count: number
} | {
  type: 'ball'
}) & {
  pos: Vector // coord instead of position
}

type Ball = {
  pos: Vector // center
  speed: Vector
  wait: number
  die: boolean
}

type Game = {
  over: boolean
  state: 'waiting' | 'running'
  level: number
  cubes: Cube[]
  ballCount: number
  balls: Ball[]
  ballStartX: number
}

const width = 300;
const height = 400;
const cubeSize = 20;
const cubePadding = 1;
const cubeCountPerRow = 15;
const cubeTextSize = cubeSize / 1.5;
const cubeTextSmallSize = cubeSize / 2;
const ballRadius = 5;
const topPadding = cubeSize * 3;
const bottomY = height - cubeSize;
const overY = height - cubeSize - ballRadius;
const cubeBallCollideSize = cubeSize / 2 - cubePadding + ballRadius;

export function newGame(container: HTMLElement) {

  const game: Game = {
    over: false,
    level: 0,
    state: 'waiting',
    cubes: [],
    ballCount: 1,
    balls: [],
    ballStartX: 0,
  };
  const root = d3.select(container)
    .append('svg')
    .attr('viewBox', '0 0 300 400')
    .attr('class', 'w-full h-full max-w-screen max-h-screen font-mono select-none');
  root.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'black');
  const cubes = root.append('g')
    .attr('id', 'cubes')
    .attr('transform', `translate(0 ${topPadding})`);
  const balls = root.append('g')
    .attr('id', 'balls');
  const ballHelper = root.append('line')
    .attr('id', 'ball-helper')
    .attr('stroke', 'white');
  const overText = root.append('g')
    .attr('visibility', 'hidden');
  overText.append('text')
    .text('Game Over')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('stroke', 'red')
    .attr('fill', 'black')
    .attr('font-size', width / 10)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central');
  overText.append('text')
    .text('click to restart')
    .attr('x', width / 2)
    .attr('y', height / 2 + width / 10)
    .attr('fill', 'red')
    .attr('font-size', width / 25)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central');
  const scorePane = root.append('g');
  const scoreText = scorePane.append('text')
    .attr('x', 6)
    .attr('y', 4)
    .attr('fill', 'white')
    .attr('font-size', 10)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'hanging');
  const ballText = scorePane.append('text')
    .attr('x', 11.4)
    .attr('y', 15)
    .attr('fill', 'white')
    .attr('font-size', 10)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'hanging');

  root.on('pointermove', (ev: PointerEvent) => {
    if (game.state === 'waiting') {
      const v1 = Vector.of(game.ballStartX, bottomY);
      const vp = Vector.of(d3.pointer(ev));
      const v2 = vp.minus(v1).normalize(100).add(v1);
      ballHelper
        .attr('visibility', 'visible')
        .attr('stroke-dasharray', 10)
        .attr('stroke-dashoffset', 10)
        .attr('x1', v1.x)
        .attr('y1', v1.y)
        .attr('x2', v2.x)
        .attr('y2', v2.y);
    }
  });

  root.on('click', (ev: MouseEvent) => {
    if (game.over) {
      newGame();
    } else if (game.state === 'waiting') {
      const v1 = Vector.of(game.ballStartX, bottomY);
      const v = Vector.of(d3.pointer(ev));
      const speed = v.minus(v1).normalize(400);
      game.balls.forEach(b => b.speed = speed);
      game.state = 'running';
      ballHelper
        .attr('visibility', 'hidden');
    }
  });

  function newGame() {
    game.over = false;
    game.level = 0;
    game.state = 'waiting';
    game.cubes = [];
    game.ballCount = 1;
    game.balls = [];
    overText.attr('visibility', 'hidden');
    newLevel();
  }

  function newLevel() {
    game.state = 'waiting';
    game.level += 1;
    game.cubes.forEach(e => e.pos = e.pos.add(Vector.of(0, 1)));
    const newCubes: Cube[] = [];
    randomSub(range(cubeCountPerRow), randomInt(cubeCountPerRow * 0.4, cubeCountPerRow * 0.9)).forEach((e) => {
      let count = Math.ceil(game.level * randomFloat(0.5, 0.8));
      if (randomFloat() < 0.1) {
        count += Math.ceil(game.level * 0.5 + game.ballCount);
      }
      newCubes.push({
        type: 'cube',
        count: count*2,
        pos: Vector.of(e, 0),
      });
    });
    if (randomFloat() < 111 + 1 / Math.sqrt(game.level)) {
      const idx = randomInt(newCubes.length);
      newCubes[idx].type = 'ball';
    }
    game.cubes.push(...newCubes);
    game.ballStartX = randomFloat(0.2, 0.8) * width;
    game.balls = range(game.ballCount).map((i) => ({
      pos: Vector.of(game.ballStartX, bottomY),
      speed: Vector.zero,
      wait: i * 100,
      die: false,
    }));

    scoreText.text(`Level: ${game.level}`);
    ballText.text(`Ball: ${game.ballCount}`);
    renderCubes();
    renderBalls();

    if (game.cubes[0].pos.y * cubeSize + topPadding > overY) {
      game.over = true;
      overText.attr('visibility', 'visible');
    }
  }

  function move(millis: number) {
    let needRenderCube = false;
    const cubeMap = new Map<number, Cube>();
    game.cubes.forEach(e => cubeMap.set(e.pos.x + e.pos.y * cubeCountPerRow, e));
    game.balls
      .filter(e => !e.die && e.wait < millis)
      .forEach(b => {
        let [x, y] = b.pos.add(b.speed.multi((millis - b.wait) / 1000)).array;
        let [sx, sy] = b.speed.array;

        // world collide
        if (x < ballRadius) {
          x = flip(x, ballRadius);
          sx = -sx;
        } else if (x > width - ballRadius) {
          x = flip(x, width - ballRadius);
          sx = -sx;
        }
        if (y < ballRadius) {
          y = flip(y, ballRadius);
          sy = -sy;
        } else if (y > bottomY) {
          // ball die
          y = bottomY;
          sx = 0;
          sy = 0;
          b.die = true;
        }

        // cube collide
        const cellX = Math.floor(x / cubeSize);
        const cellY = Math.floor((y - topPadding) / cubeSize);
        const possibleCubes = range(9)
          .map(e => cubeMap.get((cellX + Math.floor(e / 3) - 1) + (cellY + e % 3 - 1) * cubeCountPerRow))
          .filter(e => !!e)
          .map(e => e as Cube);
        possibleCubes.forEach(e => {
          const cx = (e.pos.x + 0.5) * cubeSize;
          const cy = (e.pos.y + 0.5) * cubeSize + topPadding;
          if (
            Math.abs(x - cx) < cubeBallCollideSize &&
            Math.abs(y - cy) < cubeBallCollideSize
          ) {
            needRenderCube = true;
            if (e.type === 'ball') {
              game.ballCount += 1;
              game.cubes.splice(game.cubes.indexOf(e), 1);
              return;
            } else {
              e.count -= 1;
              if (e.count === 0) {
                game.cubes.splice(game.cubes.indexOf(e), 1);
              }
              const rel = Vector.of(cx, cy).minus(b.pos);
              if (rel.y > rel.x) {
                if (rel.y > -rel.x) {
                  // collide cube top
                  y = flip(y, cy - cubeSize / 2 + cubePadding - ballRadius);
                  sy = -sy;
                } else {
                  // collide cube right
                  x = flip(x, cx + cubeSize / 2 - cubePadding + ballRadius);
                  sx = -sx;
                }
              } else {
                if (rel.y > -rel.x) {
                  // collide cube left
                  x = flip(x, cx - cubeSize / 2 + cubePadding - ballRadius);
                  sx = -sx;
                } else {
                  // collide cube bottom
                  y = flip(y, cy + cubeSize / 2 - cubePadding + ballRadius);
                  sy = -sy;
                }
              }
            }
          }
        });
        b.pos = Vector.of(x, y);
        b.speed = Vector.of(sx, sy);
      });
    game.balls.forEach(e => e.wait = Math.max(0, e.wait - millis));
    if (needRenderCube) {
      renderCubes();
    }
  }

  function renderCubes() {
    const gs = cubes
      .selectAll('g')
      .data(game.cubes)
      .join('g')
      .attr('id', e => `${e.pos.x}-${e.pos.y}`)
      .attr('transform', e => `translate(${e.pos.x * cubeSize} ${e.pos.y * cubeSize})`);
    gs.selectAll('rect')
      .data(e => [e])
      .join('rect')
      .attr('x', cubePadding)
      .attr('y', cubePadding)
      .attr('rx', e => e.type === 'ball' ? '100%' : '')
      .attr('width', cubeSize - cubePadding * 2)
      .attr('height', cubeSize - cubePadding * 2)
      .attr('fill', e => e.type === 'cube' ? d3.interpolateRainbow(1 - Math.sqrt(e.count) / 10) : 'white');
    gs.selectAll('text')
      .data(e => [e])
      .join('text')
      .text(e => e.type === 'cube' ? e.count : '+1')
      .attr('x', cubeSize / 2)
      .attr('y', cubeSize / 2)
      .attr('font-size', e => e.type === 'cube' && e.count >= 100 ? cubeTextSmallSize : cubeTextSize)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');
  }

  function renderBalls() {
    balls.selectAll('circle')
      .data(game.balls)
      .join('circle')
      .attr('r', ballRadius)
      .attr('cx', e => e.pos.x)
      .attr('cy', e => e.pos.y)
      .attr('fill', 'white');
  }

  newGame();

  let handle = -1;
  let lastTime = -1;
  const frame = (time: number) => {
    handle = requestAnimationFrame(frame);
    if (lastTime === -1) {
      lastTime = time;
      return;
    }
    const timeSpent = time - lastTime;
    lastTime = time;

    if (game.over) {
      return;
    }

    switch (game.state) {
      case 'running':
        if (game.balls.every(e => e.die)) {
          newLevel();
        } else {
          move(Math.min(timeSpent, 20));
          renderBalls();
        }
        break;
      case 'waiting':
        break;
      default:
        caseNever(game.state);
    }
  };
  handle = requestAnimationFrame(frame);
  return () => {
    root.remove();
    cancelAnimationFrame(handle);
  };
}