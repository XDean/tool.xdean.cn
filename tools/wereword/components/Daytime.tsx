import {Interpreter} from 'xstate';
import {WerewordContext, WerewordEvent, WerewordSchema} from '../machine';
import {useService} from '@xstate/react';
import {WerewordImages} from './Images';
import {WerewordToolbar} from './Toolbar';
import {AnswerView} from './Answer';
import {useBindSound} from './util';

export const WerewordDayTime = ({service}: { service: Interpreter<WerewordContext, WerewordSchema, WerewordEvent> }) => {
  const [state, send] = useService(service);
  const bindSound = useBindSound([state]);

  const prefix = '/tools/wereword/sound/man';
  bindSound(`${prefix}/day_guess.mp3`, () => state.matches('play.daytime.guess'));
  bindSound(`${prefix}/find_xianzhi.mp3`, () => state.matches('play.daytime.find') && state.context.correct);
  bindSound(`${prefix}/find_langren.mp3`, () => state.matches('play.daytime.find') && !state.context.correct);
  return (
    <>
      <div className={'w-max m-auto relative'}>
        <div className={'absolute -left-20'}>
          <WerewordToolbar service={service}/>
        </div>
        <WerewordImages.Logo/>
      </div>
      <div className={'flex-grow w-full relative'}>
        {state.matches('play.daytime.guess') && (
          <div>
            <div className={'text-center text-5xl my-4'}>
              猜词阶段
            </div>
            <div className={'text-center text-4xl mb-4'}>
              剩余 {state.context.leftSeconds} 秒
            </div>
            <div className={'flex items-center justify-evenly'}>
              <div className={''} onClick={() => send('CORRECT')}>
                <WerewordImages.Correct/>
              </div>
              <div className={''} onClick={() => send('NO_TOKEN')}>
                <WerewordImages.NoToken/>
              </div>
            </div>

          </div>
        )}
        {state.matches('play.daytime.find') && (
          <div>
            <div className={'text-center text-5xl my-2'}>
              投票阶段
            </div>
            <div className={'text-center text-3xl my-2 leading-normal'}>
              {state.context.correct ? '狼人' : '村民'}请找出{state.context.correct ? '先知' : '狼人'}<br/>
              剩余 {state.context.leftSeconds} 秒
            </div>
            <AnswerView answer={state.context.answer}/>
          </div>
        )}
      </div>
    </>
  );
};