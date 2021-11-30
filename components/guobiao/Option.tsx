import {Options} from "lib/guobiao/type";
import clsx from "clsx";
import {TilePoint} from "lib/guobiao/tile";
import css from './styles.module.css'

export const OptionView = (
  {
    options,
    onOptionsChange
  }: {
    options: Options,
    onOptionsChange: (o: Options) => void
  }
) => {
  const BoolButton = ({label, field}: { label: string, field: keyof Options }) => (
    <button onClick={() => onOptionsChange({...options, [field]: !options[field]})}
            className={clsx(css.btn, options[field] && css.active)}>
      {label}
    </button>
  )
  return (
    <div className={'whitespace-nowrap text-lg md:text-2xl'}>
      <div className={'flex flex-row items-center justify-evenly mb-1'}>
        <BoolButton label={'自摸'} field={"zimo"}/>
        <BoolButton label={'绝张'} field={"juezhang"}/>
        <BoolButton label={'杠开'} field={"gangShang"}/>
        <BoolButton label={'海底'} field={"lastTile"}/>
      </div>
      <div className={'flex flex-row items-center justify-evenly mb-2'}>
        <button onClick={() => onOptionsChange({...options, quanfeng: (options.quanfeng % 4 + 1) as TilePoint})}
                className={css.btn}>
          {fengStr(options.quanfeng)}风圈
        </button>
        <button onClick={() => onOptionsChange({...options, menfeng: (options.menfeng % 4 + 1) as TilePoint})}
                className={css.btn}>
          {fengStr(options.menfeng)}风位
        </button>
        <select className={css.btn}
                onChange={e => onOptionsChange({...options, hua: Number(e.target.value)})}>
          {[...Array(9).keys()].map(k => (
            <option key={k} value={k}>花牌: {k}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function fengStr(point: TilePoint) {
  return '东南西北'[point - 1]
}