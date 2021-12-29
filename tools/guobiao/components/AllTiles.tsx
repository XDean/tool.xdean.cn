import {Tiles} from 'tools/guobiao/core/type';
import {Tile} from 'tools/guobiao/core/tile';
import {TileButton} from './TileButton';

type Props = {
  onTileClick: (tile: Tile) => void,
  disabledTiles: Tiles,
  disableAll: boolean,
}
export const AllTilesView = (props: Props) => {
  const {onTileClick, disabledTiles, disableAll} = props;

  return (
    <div>
      {[Tile.T, Tile.B, Tile.W].map((ts, i) => (
        <div key={i}>
          {ts.map(t => (
            <TileButton key={t.toNumber()}
                        tile={t}
                        className={'inline-block'}
                        disable={disableAll || t.in(disabledTiles.tiles)}
                        onClick={onTileClick}
            />
          ))}
        </div>
      ))}
      <div>
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