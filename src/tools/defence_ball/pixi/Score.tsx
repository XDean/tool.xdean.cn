import { Game } from './game/game';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import css from './index.module.css';

type Props = {
  game: Game
}
export const Score: FC<Props> = observer((
  {
    game,
  },
) => {
  return (
    <div className={'w-full h-full bg-gray-600 text-white flex flex-row items-center justify-between p-2'}>
      <div className={'grid grid-cols-[auto_auto] w-max gap-y-1'}>
        <div>
          关卡：
        </div>
        <div>
          {game.level}
        </div>
        <div>
          分数：
        </div>
        <div>
          {game.score}
        </div>
        <div>
          弹球：
        </div>
        <div>
          {game.ballCount}
        </div>
      </div>
      <div>
        <button
          className={css.btn}
          onClick={() => game.stopLevel()}
        >
          强制停止
        </button>
      </div>
    </div>
  );
});