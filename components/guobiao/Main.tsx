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
  const [hand, setHand] = useState(new Hand(new Tiles([]), []))
  const [mode, setMode] = useState(modes[0])

  const [disableAll, disabledTiles] = useMemo(() => [mode.disableAll(hand), mode.disable(hand)], [mode, hand])

  const updateHand = useCallback((f: (h: Hand) => void) => setHand(h => {
    const copy = h.copy();
    f(copy)
    return copy
  }), [])

  const onTileClick = useCallback((t: Tile) => updateHand(h => mode.add(h, t)), [mode, updateHand]);
  const onHandMingClick = useCallback(i => updateHand(h => h.mings.splice(i, 1)), [updateHand]);
  const onHandTileClick = useCallback(i => updateHand(h => h.tiles.tiles.splice(i, 1)), [updateHand]);
  const onOptionsChange = useCallback(o => updateHand(h => h.option = o), [updateHand]);

  return (
    <div className={'container mx-4'}>
      <AllTilesView
        disableAll={disableAll}
        disabledTiles={disabledTiles}
        onTileClick={onTileClick}/>
      <div className={'text-lg md:text-2xl my-2 flex flex-row items-center justify-between'}>
        {modes.map(m => (
          <button key={m.name} onClick={() => setMode(m)}
                  className={clsx(css.btn, css.fix_width, mode === m && css.active)}>
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