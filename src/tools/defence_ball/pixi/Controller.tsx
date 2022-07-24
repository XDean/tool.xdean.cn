import { observer } from 'mobx-react-lite';
import { Game } from './game/game';
import { FC } from 'react';
import { Start } from './Start';
import { Over } from './Over';

type Props = {
  game: Game
}

export const Controller: FC<Props> = observer((
  {
    game,
  },
) => {
  return (
    <>
      {game.state === 'ready' && (
        <div className={'absolute inset-0'}>
          <Start game={game}/>
        </div>
      )}
      {game.state === 'over' && (
        <div className={'absolute inset-0'}>
          <Over game={game}/>
        </div>
      )}
    </>
  );
});