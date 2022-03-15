import {Interpreter} from 'xstate';
import {WerewordContext, WerewordEvent, WerewordSchema} from '../machine';
import {useService} from '@xstate/react';
import {WerewordImages} from './Images';
import {useBindSound} from './util';

export const WerewordOver = ({service}: { service: Interpreter<WerewordContext, WerewordSchema, WerewordEvent> }) => {
  const [state, send] = useService(service);
  const bindSound = useBindSound([state]);
  bindSound(`/tools/wereword/sound/man/over.mp3`, () => true);
  return (
    <>
      <div className={'w-max m-auto relative'}>
        <WerewordImages.Logo/>
      </div>
      <div className={'text-center text-5xl my-8'}>
        游戏结束
      </div>
      <button className={'w-max m-auto btn-contain'} onClick={() => send('RESTART')}>
        再来一局
      </button>
    </>
  );
};