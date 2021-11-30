import {Tile} from 'lib/guobiao/tile';
import Image from '../../common/components/Image';
import tiles from 'public/tool/guobiao/tiles.webp';
import {useWindowSize} from 'react-use';

type Props = {
  tile: Tile | null
  width?: number
}

export const TileView = (props: Props) => {
  const size = useWindowSize();
  const defaultWidth = Math.min(size.width / 10, 64);
  const {tile, width = defaultWidth} = props;

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
    <div className={'relative overflow-hidden'} style={{width: width, height: width * 1.44}}>
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