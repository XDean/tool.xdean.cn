import * as d3 from 'd3';
import { range } from '../../../../common/util/array';
import { randomFloat, randomInt, randomSub } from '../../../../common/util/random';
import { caseNever } from '../../../../common/util/base';


type Cube = ({
  type: 'cube'
  count: number
} | {
  type: 'ball'
}) & {
  x: number
  y: number
}

type Ball = {
  x: number // 0 to 14
  y: number // 0 => top
  die: boolean
}

type Game = {
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
const ballRadius = 6;
const bottomY = 380;

export function newGame(container: HTMLElement) {

  const game: Game = {
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
    .attr('class', 'max-w-screen max-h-screen font-mono bg-black');
  const cubes = root.append('g')
    .attr('id', 'cubes');
  const balls = root.append('g')
    .attr('id', 'balls');
  const ballHelper = root.append('line')
    .attr('id', 'ball-helper')
    .attr('stroke', 'white');

  function euclideanDistance(a: [number, number], b: [number, number]) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
  }

  root.on('pointermove', (ev: PointerEvent) => {
    if (game.state === 'waiting') {
      const x1 = game.ballStartX;
      const y1 = bottomY;
      const [x, y] = d3.pointer(ev);
      const distance = euclideanDistance([game.ballStartX, bottomY], [x, y]);
      const ratio = 100 / distance;
      const x2 = (x - x1) * ratio + x1;
      const y2 = (y - y1) * ratio + y1;
      ballHelper
        .attr('stroke-dasharray', 10)
        .attr('stroke-dashoffset', 10)
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2);
    }
  });

  function newLevel() {
    game.state = 'waiting';
    game.level += 1;
    game.cubes.forEach(e => e.y += 1);
    randomSub(range(cubeCountPerRow), randomInt(cubeCountPerRow * 0.4, cubeCountPerRow * 0.8 + 1)).forEach((e) => {
      game.cubes.push({
        type: 'cube',
        count: Math.ceil(game.level * randomFloat(0.5, 20)),
        x: e,
        y: 0,
      });
    });
    game.ballStartX = randomFloat(0.2, 0.8) * width;
    game.balls = range(game.ballCount).map(() => ({
      die: false,
      x: game.ballStartX,
      y: bottomY,
    }));
  }

  function collideTest() {

  }

  function render() {
    // render cubes
    const gs = cubes
      .selectAll('g')
      .data(game.cubes)
      .join('g')
      .attr('transform', e => `translate(${e.x * cubeSize} ${e.y * cubeSize})`);
    gs.selectAll('rect')
      .data(e => [e])
      .join('rect')
      .attr('x', cubePadding)
      .attr('y', cubePadding)
      .attr('width', cubeSize - cubePadding * 2)
      .attr('height', cubeSize - cubePadding * 2)
      .attr('fill', e => e.type === 'cube' ? d3.interpolateSinebow((e.count % 13) / 13) : '');
    gs.selectAll('text')
      .data(e => [e])
      .join('text')
      .text(e => e.type === 'cube' ? e.count : '+1')
      .attr('x', cubeSize / 2)
      .attr('y', cubeSize / 2)
      .attr('font-size', cubeTextSize)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');

    // render balls
    balls.selectAll('circle')
      .data(game.balls)
      .join('circle')
      .attr('r', ballRadius)
      .attr('cx', e => e.x)
      .attr('cy', e => e.y)
      .attr('fill', 'white');

  }

  newLevel();

  let handle = -1;
  const frame = () => {
    handle = requestAnimationFrame(frame);
    render();
    switch (game.state) {
      case 'running':
        if (game.balls.every(e => e.die)) {
          newLevel();
        } else {
          collideTest();
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