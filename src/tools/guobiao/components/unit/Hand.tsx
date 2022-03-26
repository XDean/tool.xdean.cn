import {Hand} from '../../core/type';
import {MingView} from './Ming';
import {TilesView} from './Tiles';
import {TileView} from './Tile';

type Props = {
  value: Hand
  scale?: number
}

export const HandView = (props: Props) => {
  const {value, scale = 1} = props;
  return (
    <div className={'flex flex-row flex-wrap space-x-1'}>
      {value.mings.map((e, i) => (
        <MingView value={e} key={i} scale={scale}/>
      ))}
      <TilesView tiles={value.tiles.withoutLast.tiles} scale={scale}/>
      <TileView tile={value.tiles.last} scale={scale}/>
    </div>
  );
};
