import { Vector } from '../../util';

export function collideSquareCircle(
  squareCenter: Vector,
  squareSize: number,
  circleCenter: Vector,
  circleRadius: number,
) {
  const dx = circleCenter.x - Math.max(squareCenter.x - squareSize / 2, Math.min(circleCenter.x, squareCenter.x + squareSize / 2));
  const dy = circleCenter.y - Math.max(squareCenter.y - squareSize / 2, Math.min(circleCenter.y, squareCenter.y + squareSize / 2));
  return (dx ** 2 + dy ** 2) < (circleRadius ** 2);
}

export function collideCircle(
  c1: Vector,
  r1: number,
  c2: Vector,
  r2: number,
) {
  return ((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2) < ((r1 + r2) ** 2);
}