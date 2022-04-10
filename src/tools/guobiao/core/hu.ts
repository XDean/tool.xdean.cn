import { calcFan } from './fan';
import { Tile, TileNumberTypes, TilePoint } from './tile';
import { BuKao, Combination, Dui, Hand, Hu, Ke, QiDui, Shun, Tiles, Yao13, ZuHeLong } from './type';

export function calcHuBest(hand: Hand): Hu | null {
  const hus = calcHu(hand);
  if (hus.length === 0) {
    return null;
  }
  return hus.reduce((a, b) => a.totalScore > b.totalScore ? a : b);
}

export function calcHu(hand: Hand): Hu[] {
  if (hand.count != 14) {
    throw 'hand count must be 14';
  }
  const mingComb = new Combination(hand.mings.map(m => m.toMian()));
  const result = [];
  for (let comb of findAllCombinations(hand.tiles)) {
    const completeComb = mingComb.with(...comb.mians);
    const fans = calcFan(hand, completeComb);
    result.push(new Hu(completeComb, fans));
  }
  return result;
}

export function findAllCombinations(tiles: Tiles): Combination[] {
  if ((tiles.length - 2) % 3 !== 0 || tiles.length > 14) {
    return [];
  }
  const res = [];
  if (tiles.length === 14) {
    const yao = find13Yao(tiles);
    if (!!yao) {
      return [new Combination([yao])];
    }
    const bukao = findBuKao(tiles);
    if (!!bukao) {
      return [new Combination([bukao])];
    }
    const qidui = findQiDui(tiles);
    if (!!qidui) {
      res.push(new Combination([qidui]));
    }
  }
  const duis = findDui(tiles);
  for (let [left, dui] of duis) {
    for (let [l, zhl] of findZuHeLong(left)) {
      for (let sub of findShunKeCombinations(l)) {
        res.push(sub.with(zhl).with(dui));
      }
    }
    for (let comb of findShunKeCombinations(left)) {
      res.push(comb.with(dui));
    }
  }
  return res;
}

function findShunKeCombinations(tiles: Tiles): Combination[] {
  if (tiles.length === 0) {
    return [new Combination([])];
  }
  if (tiles.length < 3) {
    return [];
  }
  const res = [];
  for (let [left, ke] of findKe(tiles, tiles.last)) {
    for (let sub of findShunKeCombinations(left)) {
      res.push(sub.with(ke));
    }
  }
  for (let [left, shun] of findShun(tiles, tiles.last)) {
    for (let sub of findShunKeCombinations(left)) {
      res.push(sub.with(shun));
    }
  }
  return res;
}

function findDui(tiles: Tiles): [Tiles, Dui][] {
  const results: [Tiles, Dui][] = [];
  for (let t of tiles.filterMoreThan(1).distinct.tiles) {
    const [left] = tiles.split(t, t);
    results.push([left, new Dui(t)]);
  }
  return results;
}


function findShun(tiles: Tiles, tile: Tile): [Tiles, Shun][] {
  if (tile.type === 'z' || tiles.length < 3) {
    return [];
  }
  return [-2, -1, 0].map(p => p + tile.point)
    .filter(p => p >= 1 && p <= 7)
    .map(p => new Shun(new Tile(tile.type, p as TilePoint)))
    .filter(s => tiles.contains(s.toTiles))
    .map(s => [tiles.split(...s.toTiles.tiles)[0], s]);
}

function findKe(tiles: Tiles, tile: Tile): [Tiles, Ke][] {
  const sames = tiles.filterType(tile.type).filterPoint(tile.point);
  if (sames.length > 2) {
    const [left] = tiles.split(tile, tile, tile);
    return [[left, new Ke(tile)]];
  } else {
    return [];
  }
}

function findZuHeLong(tiles: Tiles): [Tiles, ZuHeLong][] {
  if (tiles.length < 9) {
    return [];
  }
  const distinct = tiles.distinct;
  const types = [
    distinct.filterType('w'),
    distinct.filterType('b'),
    distinct.filterType('t'),
  ];
  if (types.some(t => t.length < 3)) {
    return [];
  }
  const groups = types.map(ts => {
    const points: TilePoint[][] = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];
    return points.map(ps => ts.filterPoint(...ps))
      .filter(t => t.length === 3);
  });
  if (groups.some(t => t.length === 0)) {
    return [];
  }
  for (let m of groups[0]) {
    for (let p of groups[1]) {
      for (let s of groups[2]) {
        const mp = m.minPointTile.point;
        const pp = p.minPointTile.point;
        const sp = s.minPointTile.point;
        if (mp != pp && mp != sp && pp != sp) {
          const [left, used] = tiles.split(...m.tiles, ...p.tiles, ...s.tiles);
          return [[left, new ZuHeLong(used)]];
        }
      }
    }
  }
  return [];
}

function findQiDui(tiles: Tiles): QiDui | null {
  const single = [];
  const pair = [];
  for (let tile of tiles.tiles) {
    const index = tile.indexIn(single);
    if (index === -1) {
      single.push(tile);
    } else {
      single.splice(index, 1);
      pair.push(tile);
    }
  }
  if (single.length === 0) {
    return new QiDui(new Tiles(pair));
  } else {
    return null;
  }
}

function find13Yao(tiles: Tiles): Yao13 | null {
  if (tiles.allIn(Tile.Yao) && tiles.distinct.length === 13) {
    const duis = findDui(tiles);
    return new Yao13(duis[0][1].tile);
  } else {
    return null;
  }
}

function findBuKao(tiles: Tiles): BuKao | null {
  if (tiles.distinct.length != 14) {
    return null;
  }
  const numbers = tiles.filterType(...TileNumberTypes);
  if (numbers.mostPoint[1] > 1) {
    return null;
  }
  if (([[1, 4, 7], [2, 5, 8], [3, 6, 9]] as TilePoint[][]).some(ps => {
    const ts = numbers.filterPoint(...ps);
    return ts.length > ts.mostType[1];
  })) {
    return null;
  }
  if (TileNumberTypes.map(t => tiles.filterType(t)).every(ts => {
    for (let [a, b] of ts.pairs()) {
      const diff = Math.abs(a.point - b.point);
      if (diff % 3 !== 0) {
        return false;
      }
    }
    return true;
  })) {
    return new BuKao(tiles);
  } else {
    return null;
  }
}