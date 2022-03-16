import {Tile} from 'src/tools/guobiao/core/tile';
import useWindowDimensions from '../../../../common/util/hook';
import {notSSR} from '../../../../common/util/react';

type Props = {
  tile: Tile | null
  scale?: number
  onClick?: () => void
}

export const TileView = notSSR((props: Props) => {
  const {clientWidth} = useWindowDimensions();
  const {tile, scale = 1, onClick} = props;
  const width = Math.max(32, Math.min(64, clientWidth / 10)) * scale;
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
    <div className={'relative overflow-hidden'}
         onClick={onClick}
         style={{
           width,
           height,
           backgroundImage: `url(/tool/guobiao/tiles.webp})`,
           backgroundPositionX: -offset * width,
           backgroundSize: width * 54,
         }}
    />
  );
});