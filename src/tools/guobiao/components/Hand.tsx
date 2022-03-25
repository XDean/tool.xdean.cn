import clsx from 'clsx';
import { Hand } from 'src/tools/guobiao/core/type';
import { TileButton } from './TileButton';

type Props = {
  hand: Hand,
  onMingClick: (index: number) => void,
  onTileClick: (index: number) => void,
};

export const HandView = (props: Props) => {
  const {hand, onTileClick, onMingClick} = props;
  return (
    <div className={''}>
      <div className={'flex flex-wrap justify-center'}>
        {hand.mings.map((m, i) => (
          <TileButton tile={m.toMian().toTiles.tiles}
                      className={'mx-2 my-1'}
                      onClick={() => onMingClick(i)}/>
        ))}
      </div>
      <div className={'flex flex-wrap'}>
        {(hand.count === 14 ? hand.tiles.withoutLast.tiles : hand.tiles.tiles)
          .sort((a, b) => a.toNumber() - b.toNumber())
          .map((t, i) => (
            <TileButton tile={t}
                        className={'my-1 mx-0.5'}
                        onClick={() => onTileClick(i)}/>
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