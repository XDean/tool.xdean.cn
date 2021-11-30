import {Tiles} from "lib/guobiao/type";
import {Tile} from "lib/guobiao/tile";
import {TileButton} from "./TileButton";

type Props = {
  onTileClick: (tile: Tile) => void,
  disabledTiles: Tiles,
  disableAll: boolean,
}
export const AllTilesView = (props: Props) => {
  const {onTileClick, disabledTiles, disableAll} = props

  return (
    <table>
      <tbody>
      {[Tile.T, Tile.B, Tile.W].map((ts, i) => (
        <tr key={i}>
          {ts.map(t => (
            <td key={t.toNumber()}>
              <TileButton tile={t}
                          disable={disableAll || t.in(disabledTiles.tiles)}
                          onClick={onTileClick}
              />
            </td>
          ))}
        </tr>
      ))}
      <tr>
        {Tile.F.map(t => (
          <td key={t.point}>
            <TileButton tile={t}
                        disable={disableAll || t.in(disabledTiles.tiles)}
                        onClick={onTileClick}
            />
          </td>
        ))}
        {Tile.Y.map(t => (
          <td key={t.point}>
            <TileButton tile={t}
                        disable={disableAll || t.in(disabledTiles.tiles)}
                        onClick={onTileClick}
            />
          </td>
        ))}
      </tr>
      </tbody>
    </table>
  )
}