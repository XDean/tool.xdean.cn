import Image from 'next/image';
import tiles from 'public/tool/guobiao/tiles.webp';
import {useMemo} from 'react';
import {Tile} from 'src/tools/guobiao/core/tile';
import useWindowDimensions from '../../../../../common/util/hook';
import {notSSR} from '../../../../../common/util/react';

type Props = {
  tile: Tile | null
  onClick?: () => void
  scale?: number
}

export const TileView = notSSR((props: Props) => {
  const {tile, onClick, scale = 1} = props;
  const {clientWidth} = useWindowDimensions();
  const width = Math.max(32, Math.min(48, (clientWidth - 100) / 9)) * scale;
  const height = width * 1.44;


  const offset = useMemo(() => {
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
  }, [tile]);

  return (
    <div className={'relative overflow-hidden flex'}
         style={{width: width}}
         onClick={onClick}>
      <Image src={tiles}
             height={height}
             layout={'fixed'}
             objectFit={'cover'}
             objectPosition={-offset * width}
      />
    </div>
  );
});