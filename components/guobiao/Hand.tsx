import {Hand} from "lib/guobiao/type";
import {MingView} from "./Ming";
import {TileView} from "./Tile";
import clsx from "clsx";

type Props = {
  hand: Hand,
  onMingClick: (index: number) => void,
  onTileClick: (index: number) => void,
};
export const HandView = (props: Props) => {
  const {hand, onTileClick, onMingClick} = props
  const tileClass = 'cursor-pointer hover:scale-105 hover:z-10 transform relative active:scale-110 transition-transform'
  return (
    <div className={''}>
      <div className={'grid grid-cols-2 auto-rows-auto mx-1'}>
        {hand.mings.map((m, i) => (
          <div key={i}
               className={clsx(tileClass, 'm-1 md:m-2')}
               onClick={() => onMingClick(i)}>
            <MingView ming={m}/>
          </div>
        ))}
      </div>
      <div className={'grid grid-cols-7 auto-rows-auto w-max m-2 gap-1'}>
        {(hand.count === 14 ? hand.tiles.withoutLast.tiles : hand.tiles.tiles).map((t, i) => (
          <div key={i}
               className={clsx(tileClass, 'inline-block')}
               onClick={() => onTileClick(i)}>
            <TileView tile={t}/>
          </div>
        ))}
      </div>
      {hand.count === 14 &&
      <div
        className={clsx(tileClass, 'inline-block mx-2 flex items-center mb-2')}
        onClick={() => onTileClick(hand.tiles.length - 1)}>
        和张：
        <TileView tile={hand.tiles.last}/>
      </div>
      }
    </div>
  )
}