import { Tile } from '../../core/tile';
import { TileView } from './Tile';

type Props = {
  tiles: (Tile | null)[]
  scale?: number
}

export const TilesView = (props: Props) => {
  const {scale = 1, tiles} = props;
  return (
    <div className={'flex'}>
      {tiles.map((e, i) => (
        <TileView key={i} tile={e} scale={scale}/>
      ))}
    </div>
  );
};