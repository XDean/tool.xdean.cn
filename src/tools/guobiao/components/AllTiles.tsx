import {Tiles} from 'src/tools/guobiao/core/type';
import {Tile} from 'src/tools/guobiao/core/tile';
import {TileButton} from './TileButton';

type Props = {
  onTileClick: (tile: Tile) => void,
  disabledTiles: Tiles,
  disableAll: boolean,
}
export const AllTilesView = (props: Props) => {
  const {onTileClick, disabledTiles, disableAll} = props;

  return (
    <div className={'space-y-2'}>
      {[Tile.T, Tile.B, Tile.W].map((ts, i) => (
        <div key={i} className={'flex flex-row items-center space-x-[2px]'}>
          {ts.map(t => (
            <TileButton key={t.toNumber()}
                        tile={t}
                        disable={disableAll || t.in(disabledTiles.tiles)}
                        onClick={onTileClick}
            />
          ))}
        </div>
      ))}
      <div className={'flex flex-row items-center space-x-[2px]'}>
        {Tile.F.map(t => (
          <TileButton key={t.point}
                      tile={t}
                      className={'inline-block'}
                      disable={disableAll || t.in(disabledTiles.tiles)}
                      onClick={onTileClick}
          />
        ))}
        {Tile.Y.map(t => (
          <TileButton key={t.point}
                      tile={t}
                      className={'inline-block'}
                      disable={disableAll || t.in(disabledTiles.tiles)}
                      onClick={onTileClick}
          />
        ))}
      </div>
    </div>
  );
};