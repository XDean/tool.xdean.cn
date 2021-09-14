import {Tiles} from "lib/guobiao/type";
import {TileView} from "./Tile";
import clsx from "clsx";
import {Tile, TileNumberTypes, TilePoints} from "lib/guobiao/tile";
import {useMemo} from "react";

export const AllTilesView = (
  {onTileClick, disabledTiles, disableAll}: {
    onTileClick: (tile: Tile) => void,
    disabledTiles: Tiles,
    disableAll: boolean,
  }
) => {

  const TileButton = ({tile}: { tile: Tile }) => {
    const disabled = useMemo(() => disableAll || tile.in(disabledTiles.tiles), [disableAll, disabledTiles])
    return (
      <div
        className={clsx({'opacity-50': disabled},
          'cursor-pointer hover:scale-125 hover:z-10 transform relative active:scale-150 transition-transform')}
        onClick={() => !disabled && onTileClick(tile)}>
        <TileView tile={tile}/>
      </div>
    )
  }

  return (
    <table>
      <tbody>
      {TileNumberTypes.map(t => (
        <tr key={t}>
          {TilePoints.map(p => (
            <td key={p}>
              <TileButton tile={new Tile(t, p)}/>
            </td>
          ))}
        </tr>
      ))}
      <tr>
        {Tile.F.map(t => (
          <td key={t.point}>
            <TileButton tile={t}/>
          </td>
        ))}
        {Tile.Y.map(t => (
          <td key={t.point}>
            <TileButton tile={t}/>
          </td>
        ))}
      </tr>
      </tbody>
    </table>
  )
}