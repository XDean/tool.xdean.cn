import {Ming} from '../../core/type';
import {TilesView} from './Tiles';

type Props = {
  value: Ming
  scale?: number
}
export const MingView = (props: Props) => {
  const {value, scale = 1} = props;

  switch (value.type) {
    case 'chi':
    case 'peng':
      return <TilesView tiles={value.toMian().toTiles.tiles} scale={scale}/>;
    case 'gang':
      if (value.open) {
        return <TilesView tiles={value.toMian().toTiles.tiles} scale={scale}/>;
      } else {
        return <TilesView
          tiles={[
            value.tile,
            null,
            null,
            value.tile,
          ]}
          scale={scale}/>;
      }
    default:
      throw 'never';
  }
};