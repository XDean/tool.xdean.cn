export class Vector {

  static of(x: number, y: number): Vector;
  static of(xy: [number, number]): Vector;
  static of(xy: number | [number, number], y?: number): Vector {
    if (Array.isArray(xy)) {
      return new Vector(xy[0], xy[1]);
    } else {
      return new Vector(xy, y!);
    }
  }

  static zero = new Vector(0, 0);

  constructor(
    readonly x: number,
    readonly y: number,
  ) {

  }

  distance(v: Vector) {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }

  normalize(len: number = 1): Vector {
    return this.multi(len / this.length());
  }

  length() {
    return this.distance(Vector.zero);
  }

  multi(f: number): Vector {
    return Vector.of(this.x * f, this.y * f);
  }

  add(v: Vector): Vector {
    return Vector.of(this.x + v.x, this.y + v.y);
  }

  minus(v: Vector): Vector {
    return Vector.of(this.x - v.x, this.y - v.y);
  }

  get array(): [number, number] {
    return [this.x, this.y];
  }

  withX(x: number) {
    return Vector.of(x, this.y);
  }

  withY(y: number) {
    return Vector.of(this.x, y);
  }

  flipX(x: number = 0) {
    return Vector.of(flip(this.x, x), this.y);
  }

  flipY(y: number = 0) {
    return Vector.of(this.x, flip(this.y, y));
  }
}

export function flip(value: number, base: number) {
  return base + (base - value);
}