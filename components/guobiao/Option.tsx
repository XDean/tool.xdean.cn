import {Options} from 'lib/guobiao/type';
import clsx from 'clsx';
import {TilePoint} from 'lib/guobiao/tile';
import css from './styles.module.css';

type Props = {
  options: Options,
  onOptionsChange: (o: Options) => void
};
export const OptionView = (props: Props) => {
  const {options, onOptionsChange} = props;
  const BoolButton = ({label, field}: { label: string, field: keyof Options }) => (
    <button onClick={() => onOptionsChange({...options, [field]: !options[field]})}
            className={clsx(css.btn, options[field] && css.active)}>
      {label}
    </button>
  );
  return (
    <div className={'space-y-2'}>
      <div className={'flex flex-row items-center justify-evenly'}>
        <BoolButton label={'自摸'} field={'zimo'}/>
        <BoolButton label={'和绝张'} field={'juezhang'}/>
        <BoolButton label={'杠上开花'} field={'gangShang'}/>
        <BoolButton label={'海底捞月'} field={'lastTile'}/>
      </div>

      <div className={'flex flex-row items-center justify-evenly'}>
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
  );
};

function fengStr(point: TilePoint) {
  return '东南西北'[point - 1];
}