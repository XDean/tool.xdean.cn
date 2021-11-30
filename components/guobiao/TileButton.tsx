import {Tile} from "../../lib/guobiao/tile";
import clsx from "clsx";
import {TileView} from "./Tile";
import React from "react";

type Props = {
  tile: Tile
  onClick: (tile: Tile) => void
  disable?: boolean
}

export const TileButton = React.memo((props: Props) => {
  const {tile, disable = false, onClick} = props
  return (
    <div
      className={clsx('relative transition-transform transform',
        disable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125 active:scale-150 hover:z-10 cursor-pointer')}
      onClick={() => !disable && onClick(tile)}>
      <TileView tile={tile}/>
    </div>
  )
})