import {Tile} from "../../lib/guobiao/tile";
import clsx from "clsx";
import {TileView} from "./Tile";
import React from "react";

type Props = {
  tile: Tile
  className?: string
  onClick: (tile: Tile) => void
  disable?: boolean
  width?: number
}

export const TileButton = React.memo((props: Props) => {
  const {tile, disable = false, onClick, className, width} = props
  return (
    <div
      className={clsx(className, 'relative transition-transform transform',
        disable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125 active:scale-150 hover:z-10 cursor-pointer')}
      onClick={() => !disable && onClick(tile)}>
      <TileView tile={tile} width={width}/>
    </div>
  )
})