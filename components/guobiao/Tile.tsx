import {Tile} from "lib/guobiao/tile";
import Image from "../../common/components/Image";
import tiles from './tiles.webp'

type Props = {
  tile: Tile
  width: number
}

export const TileView = (props: Props) => {
  const {tile, width = 64} = props

  const offset = function () {
    if (tile === null) {
      return 0
    }
    switch (tile.type) {
      case "t":
        return tile.point
      case "w":
        return 9 + tile.point;
      case "b":
        return 18 + tile.point;
      case "z":
        return 27 + tile.point;
    }
  }()
  return (
    <div className={'pt-[144%] relative overflow-hidden'} style={{width}}>
      <Image
        src={tiles}
        className={'absolute inset-0'}
        layout={"fill"}
        objectFit={'cover'}
        objectPosition={-offset * width - 1}
      />
    </div>
  )
}