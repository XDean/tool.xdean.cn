import {Tiles} from "./type";

export type TileType = 'b' | 't' | 'w' | 'z'
export const TileNumberTypes: TileType[] = ['b', 't', 'w']
export const TileTypes: TileType[] = ['b', 't', 'w', 'z']
export type TilePoint = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export const TilePoints: TilePoint[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export class Tile {
  constructor(
    readonly type: TileType,
    readonly point: TilePoint,
  ) {
  }

  get prev() {
    if (this.type === 'z' || this.point === 1) {
      throw 'cannot get prev tile'
    }
    return new Tile(this.type, (this.point - 1) as TilePoint)
  }

  get next() {
    if (this.type === 'z' || this.point === 9) {
      throw 'cannot get next tile'
    }
    return new Tile(this.type, (this.point + 1) as TilePoint)
  }

  in(tiles: Tile[] | Tiles) {
    return new Tiles(tiles).indexOf(this) !== -1
  }

  indexIn(tiles: Tile[] | Tiles) {
    return new Tiles(tiles).indexOf(this)
  }

  toNumber() {
    switch (this.type) {
      case "t":
        return this.point
      case "b":
        return this.point + 9
      case "w":
        return this.point + 18
      case "z":
        return this.point + 27
    }
  }

  compareTo(o: Tile) {
    return this.toNumber() - o.toNumber()
  }

  equals(tile: Tile) {
    return this.toNumber() == tile.toNumber();
  }

  get unicode() {
    let start = 0;
    switch (this.type) {
      case "b":
        start = 0x1F019
        break
      case "w":
        start = 0x1F007
        break
      case "z":
        start = 0x1F000
        break
      case "t":
        start = 0x1F010
        break
    }
    return String.fromCodePoint(start + this.point - 1)
  }

  static T = TilePoints.map(p => new Tile('t', p))
  static B = TilePoints.map(p => new Tile('b', p))
  static W = TilePoints.map(p => new Tile('w', p))
  static F = [1, 2, 3, 4].map(p => new Tile('z', p as TilePoint))
  static Fs = {
    dong: Tile.F[0],
    nan: Tile.F[1],
    xi: Tile.F[2],
    bei: Tile.F[3],
  }
  static Y = [5, 6, 7].map(p => new Tile('z', p as TilePoint))
  static Ys = {
    zhong: Tile.Y[0],
    fa: Tile.Y[1],
    bai: Tile.Y[2],
  }
  static Z = [...Tile.F, ...Tile.Y]
  static All = [...Tile.T, ...Tile.B, ...Tile.W, ...Tile.Z]

  static YaoJiu = [Tile.T[0], Tile.T[8], Tile.B[0], Tile.B[8], Tile.W[0], Tile.W[8]]
  static Yao = [...Tile.Z, ...Tile.YaoJiu]

  static Lv = [Tile.T[1], Tile.T[2], Tile.T[3], Tile.T[5], Tile.T[7], Tile.Ys.fa]
  static TuiBuDao = [
    Tile.T[1], Tile.T[3], Tile.T[4], Tile.T[5], Tile.T[7], Tile.T[8],
    Tile.B[0], Tile.B[1], Tile.B[2], Tile.B[3], Tile.B[4], Tile.B[7], Tile.B[8],
    Tile.Ys.bai,
  ]
}