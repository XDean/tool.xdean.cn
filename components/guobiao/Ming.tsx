import {Ming} from "lib/guobiao/type";
import {TileView} from "./Tile";
import {Tile, TilePoint} from "lib/guobiao/tile";

export const MingView = ({ming}: { ming: Ming }) => {
  return (
    <div className={'flex flex-row items-center'}>
      {function () {
        switch (ming.type) {
          case "chi":
            return [0, 1, 2].map(p => (
              <TileView key={p} tile={new Tile(ming.tile.type, (ming.tile.point + p) as TilePoint)}/>
            ))
          case "peng":
            return [0, 1, 2].map(p => (
              <TileView tile={ming.tile} key={p}/>
            ))
          case "gang":
            return [0, 1, 2, 3].map(p => (
              <TileView tile={ming.open || p === 0 || p === 3 ? ming.tile : null} key={p}/>
            ))
          default:
            return null
        }
      }()}
    </div>
  )
}