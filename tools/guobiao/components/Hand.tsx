import {Hand} from 'tools/guobiao/core/type';
import clsx from 'clsx';
import {TileButton} from './TileButton';

type Props = {
  hand: Hand,
  onMingClick: (index: number) => void,
  onTileClick: (index: number) => void,
};

export const HandView = (props: Props) => {
  const {hand, onTileClick, onMingClick} = props;
  return (
    <div className={''}>
      <div className={'grid grid-cols-2 auto-rows-auto mx-1'}>
        {hand.mings.map((m, i) => (
          <TileButton tile={m.toMian().toTiles.tiles} onClick={() => onMingClick(i)}/>
        ))}
      </div>
      <div className={'grid grid-cols-8 auto-rows-auto w-max m-2 gap-1'}>
        {(hand.count === 14 ? hand.tiles.withoutLast.tiles : hand.tiles.tiles).map((t, i) => (
          <TileButton tile={t} onClick={() => onTileClick(i)}/>
        ))}
      </div>
      {hand.count === 14 && (
        <div className={clsx('inline-block mx-2 flex items-center mb-2')}>
          和张：
          <TileButton tile={hand.tiles.last} onClick={() => onTileClick(hand.tiles.length - 1)}/>
        </div>
      )}
    </div>
  );
};