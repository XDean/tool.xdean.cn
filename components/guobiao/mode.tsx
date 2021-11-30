import {Chi, Gang, Hand, Peng, Tiles} from "../../lib/guobiao/type";
import {Tile, TileNumberTypes, TilePoint} from "../../lib/guobiao/tile";

export type Mode = {
  name: string
  label: string
  add: (hand: Hand, tile: Tile) => void
  disableAll: (hand: Hand) => boolean
  disable: (hand: Hand) => Tiles
}

export const modes: Mode[] = [
  {
    name: 'normal',
    label: '立牌',
    add: (h, t) => h.tiles.tiles.push(t),
    disableAll: hand => hand.count === 14,
    disable: hand => hand.usedTiles.filterMoreThan(3),
  }, {
    name: 'chi',
    label: '吃',
    add: (h, t) => h.mings.push(new Chi(t)),
    disableAll: hand => hand.count >= 12,
    disable: hand => new Tiles([...Tile.Z,
      ...Tile.All.filter(e => e.point >= 8),
      ...hand.usedTiles.filterType(...TileNumberTypes).filterMoreThan(3).tiles
        .flatMap(t => [0, 1, 2]
          .map(d => t.point - d)
          .filter(p => p > 0)
          .map(p => new Tile(t.type, p as TilePoint)))])
  },
  {
    name: 'peng',
    label: '碰',
    add: (h, t) => h.mings.push(new Peng(t)),
    disableAll: hand => hand.count >= 12,
    disable: hand => hand.usedTiles.filterMoreThan(1)
  },
  {
    name: 'ming-gang',
    label: '明杠',
    add: (h, t) => h.mings.push(new Gang(t, true)),
    disableAll: hand => hand.count >= 12,
    disable: hand => hand.usedTiles.distinct
  },
  {
    name: 'an-gang',
    label: '暗杠',
    add: (h, t) => h.mings.push(new Gang(t, false)),
    disableAll: hand => hand.count >= 12,
    disable: hand => hand.usedTiles.distinct
  },
]
