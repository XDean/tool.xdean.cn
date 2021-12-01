import {Tile} from 'lib/guobiao/tile';
import Image from '../../common/components/Image';
import tiles from 'public/tool/guobiao/tiles.webp';
import useWindowDimensions from '../../common/util/hook';

type Props = {
  tile: Tile | null
  scale?: number
}

export const TileView = (props: Props) => {
  const {outerWidth} = useWindowDimensions();
  const {tile, scale = 1} = props;
  const width = Math.max(32, Math.min(64, outerWidth / 10)) * scale;
  const height = width * 1.44;

  const offset = function () {
    if (tile === null) {
      return 0;
    }
    switch (tile.type) {
      case 't':
        return tile.point;
      case 'w':
        return 9 + tile.point;
      case 'b':
        return 18 + tile.point;
      case 'z':
        return 27 + tile.point;
    }
  }();
  return (
    <div className={'relative overflow-hidden'} style={{width, height}}>
      <Image
        src={tiles}
        className={'absolute inset-0'}
        layout={'fill'}
        objectFit={'cover'}
        objectPosition={-offset * width}
        unoptimized={true}
      />
    </div>
  );
};