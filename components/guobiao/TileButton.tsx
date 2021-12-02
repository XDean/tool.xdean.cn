import {Tile} from '../../lib/guobiao/tile';
import clsx from 'clsx';
import {TileView} from './Tile';
import React from 'react';

type Props = {
  tile: Tile | Tile[]
  className?: string
  onClick: (tile: Tile) => void
  disable?: boolean
}

export const TileButton = React.memo((props: Props) => {
  const {tile, disable = false, onClick, className} = props;
  let tiles = [];
  if (Array.isArray(tile)) {
    tiles = tile;
  } else {
    tiles = [tile];
  }
  return (
    <div
      className={clsx(className, 'relative transition-transform transform',
        disable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125 active:scale-150 hover:z-10 cursor-pointer')}>
      <div className={'flex flex-row'}>
        {tiles.map((t, i) =>
          <TileView tile={t} key={i} onClick={() => !disable && onClick(t)}/>,
        )}
      </div>
    </div>
  );
});