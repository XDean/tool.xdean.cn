import {Tiles} from "./type";
import {expect, test} from "@jest/globals";
import {calcTing} from "./ting";

function expectTing(
  {
    tiles,
    tings,
  }: {
    tiles: Tiles
    tings: Tiles,
  }) {
  const err = new Error()
  const line = err.stack!.split('\n')[2]
  const colon1 = line.lastIndexOf(':');
  const colon2 = line.lastIndexOf(':', colon1 - 1);
  test(`line-${line.substring(colon2 + 1, colon1)}`, () => {
    const actual = calcTing(tiles);
    const expectStrings = tings.tiles.map(t => t.unicode)
    const actualStrings = actual.map(t => t.unicode)
    expect(actualStrings).toEqual(expectStrings)
  })
}

expectTing({
  tiles: Tiles.of({'t': [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9]}),
  tings: Tiles.of({'t': [1, 2, 3, 4, 5, 6, 7, 8, 9]}),
})