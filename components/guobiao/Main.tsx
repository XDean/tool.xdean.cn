import {AllTilesView} from "./AllTiles";
import {HandView} from "./Hand";
import React, {useCallback, useMemo, useState} from "react";
import {Hand, Tiles} from "lib/guobiao/type";
import clsx from "clsx";
import {FanView} from "./Fan";
import {Tile} from "lib/guobiao/tile";
import {OptionView} from "./Option";
import css from './styles.module.css'
import {modes} from "./mode";

export const GuoBiaoMainView = () => {
  const [hand, setHand] = useState(() => new Hand(new Tiles([]), []))
  const [mode, setMode] = useState(modes[0])

  const [disableAll, disabledTiles] = useMemo(() => [mode.disableAll(hand), mode.disable(hand)], [mode, hand])

  const updateHand = useCallback((f: (h: Hand) => void) => setHand(h => {
    const copy = h.copy();
    f(copy)
    return copy
  }), [])

  const onResetClick = useCallback(() => {
    setHand(new Hand(new Tiles([]), []));
    setMode(modes[0]);
  }, []);
  const onTileClick = useCallback((t: Tile) => updateHand(h => mode.add(h, t)), [mode, updateHand]);
  const onHandMingClick = useCallback(i => updateHand(h => h.mings.splice(i, 1)), [updateHand]);
  const onHandTileClick = useCallback(i => updateHand(h => h.tiles.tiles.splice(i, 1)), [updateHand]);
  const onOptionsChange = useCallback(o => updateHand(h => h.option = o), [updateHand]);

  return (
    <div className={'container px-4 space-y-2 md:space-y-4'}>
      <div className={'relative w-max'}>
        <AllTilesView
          disableAll={disableAll}
          disabledTiles={disabledTiles}
          onTileClick={onTileClick}/>
        <button className={clsx(css.btn, 'absolute right-2 bottom-2')} onClick={onResetClick}>
          重置
        </button>
      </div>
      <div className={'flex flex-row items-center justify-between'}>
        {modes.map(m => (
          <button key={m.name} onClick={() => setMode(m)}
                  className={clsx(css.btn, css.mode, mode === m && css.active)}>
            {m.label}
          </button>
        ))}
      </div>
      <OptionView options={hand.option} onOptionsChange={onOptionsChange}/>
      <HandView hand={hand}
                onMingClick={onHandMingClick}
                onTileClick={onHandTileClick}/>
      <FanView hand={hand}/>
    </div>
  )
}