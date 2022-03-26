import {Tile} from '../core/tile';
import clsx from 'clsx';
import {TileView} from './unit/Tile';
import React from 'react';
import {Ming} from '../core/type';
import {MingView} from './unit/Ming';

type Props<T extends Tile | Ming> = {
  tile: T
  className?: string
  onClick: (tile: T) => void
  disable?: boolean
}

export const TileButton = <T extends Tile | Ming, >(props: Props<T>) => {
  const {tile, disable = false, onClick, className} = props;
  return (
    <div
      className={clsx(className, 'relative transition-transform transform',
        disable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125 active:scale-150 hover:z-10 cursor-pointer')}>
      <div className={'flex flex-row'} onClick={() => !disable && onClick(tile)}>
        {(tile instanceof Tile) ? (
          <TileView tile={tile}/>
        ) : (
          <MingView value={tile}/>
        )}
      </div>
    </div>
  );
};