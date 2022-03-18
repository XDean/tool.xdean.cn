import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { ALL_SHENG_MU, ALL_YUN_MU } from '../domain';
import { Game } from '../game';
import { getMatchColor } from '../util';

type Props = {
  game: Game
}

export const CheatSheet = observer((props: Props) => {
  const {game} = props;
  const {sm, ym} = game.cheatSheet;
  return (
    <div className={'grid grid-cols-[repeat(2,auto)] font-mono gap-x-3 text-center'}>
      <div className={'border-r'}>声 母</div>
      <div>韵 母</div>
      <div className={'grid grid-cols-2 gap-x-3 border-r px-3'}>
        {ALL_SHENG_MU.map(e => {
          const type = sm.get(e);
          return (
            <div key={e}
                 className={clsx(type && type !== 'none' && 'font-bold')}
                 style={{color: getMatchColor(type)}}>
              {e}
            </div>
          );
        })}
      </div>
      <div className={'grid grid-cols-3 gap-x-3 gap-y-1'}>
        {ALL_YUN_MU.map(e => {
          const type = ym.get(e);
          return (
            <div key={e}
                 className={clsx(type && type !== 'none' && 'font-bold')}
                 style={{color: getMatchColor(type)}}>
              {e}
            </div>
          );
        })}
      </div>
    </div>
  );
});