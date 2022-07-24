import React, { FC } from 'react';
import { Game } from './game/game';

type Props = {
  game: Game
}

export const Over: FC<Props> = (
  {
    game,
  },
) => {
  return (
    <div className={'text-center text-white w-max mt-[30%] bg-black shadow rounded-[10px] p-4 m-auto border'}>
      <div className={'text-6xl mb-16'}>
        游戏结束
      </div>
      <button className={'text-3xl border border-white rounded p-2 hover:bg-white hover:text-black transition'}
              onClick={() => game.ready()}
      >
        再来一局
      </button>
    </div>
  );
};