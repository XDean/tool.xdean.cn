import {VscRefresh} from 'react-icons/vsc';
import {Interpreter} from 'xstate';
import {WerewordContext, WerewordEvent, WerewordSchema} from '../machine';
import {useService} from '@xstate/react';
import {WerewordImages} from './Images';
import {WerewordToolbar} from './Toolbar';
import {PropsWithChildren, useCallback} from 'react';
import {AnswerView} from './Answer';
import {useBindSound} from './util';

export const WerewordNight = ({service}: { service: Interpreter<WerewordContext, WerewordSchema, WerewordEvent> }) => {
  const [state, send] = useService(service);

  const ImageWithTool = useCallback(({children}: PropsWithChildren<{}>) => (
    <div className={'w-max m-auto relative'}>
      <div className={'absolute -left-20'}>
        <WerewordToolbar service={service}/>
      </div>
      {children}
    </div>
  ), [service]);

  const bindSound = useBindSound([state]);

  const prefix = '/tools/wereword/sound/man';
  bindSound(`${prefix}/night_start.mp3`, () => state.matches('play.night.start'));
  bindSound(`${prefix}/cunzhang_select.mp3`, () => state.matches('play.night.cunzhang.select'));
  bindSound(`${prefix}/cunzhang_confirm.mp3`, () => state.matches('play.night.cunzhang.confirm'));
  bindSound(`${prefix}/xianzhi.mp3`, () => state.matches('play.night.xianzhi'));
  bindSound(`${prefix}/langren.mp3`, () => state.matches('play.night.langren'));
  bindSound(`${prefix}/night_end.mp3`, () => state.matches('play.night.end'));

  return (
    <div className={'flex-grow w-full relative'}>
      {state.matches('play.night.start') && (
        <>
          <ImageWithTool>
            <WerewordImages.Logo/>
          </ImageWithTool>
          <div className={'text-5xl h-4/5 flex text-center items-center justify-center leading-normal'}>
            夜晚开始<br/>全体闭眼<br/>{state.context.leftSeconds}秒
          </div>
        </>
      )}
      {state.matches('play.night.cunzhang') && (
        <>
          <ImageWithTool>
            <WerewordImages.Cunzhang/>
          </ImageWithTool>
          <div className={'text-center text-5xl relative w-max m-auto flex items-center my-2'}>
            村长阶段
            {state.matches('play.night.cunzhang.select') &&
            <button className={'btn-contain absolute p-1 -left-12'} onClick={() => send('CHANGE_WORD')}>
              <VscRefresh className={'w-8 h-8'}/>
            </button>
            }
          </div>
          {state.matches('play.night.cunzhang.select') && (
            <>
              <div className={'text-center text-3xl mb-3'}>
                选择魔法咒语
              </div>
              <div className={'w-max m-auto relative'}>
                <div className={'text-xl flex flex-col justify-center items-center'}>
                  {state.context.words.map((w, i) => (
                    <button key={i} className={'inline-block btn-contain my-1 w-max'}
                            onClick={() => send({type: 'SELECT_WORD', value: w})}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {state.matches('play.night.cunzhang.confirm') && (
            <>
              <div className={'text-center text-3xl mb-3'}>
                确认魔法咒语<br/>({state.context.leftSeconds}秒)
              </div>
              <AnswerView answer={state.context.answer}/>
            </>
          )}
        </>
      )}
      {state.matches('play.night.xianzhi') && (
        <>
          <ImageWithTool>
            <WerewordImages.Xianzhi/>
          </ImageWithTool>
          <div className={'text-center text-5xl w-max m-auto my-2'}>
            先知阶段<br/>({state.context.leftSeconds}秒)
          </div>
          <AnswerView answer={state.context.answer}/>
        </>
      )}
      {state.matches('play.night.langren') && (
        <>
          <ImageWithTool>
            <WerewordImages.Langren/>
          </ImageWithTool>
          <div className={'text-center text-5xl w-max m-auto my-2'}>
            狼人阶段<br/>({state.context.leftSeconds}秒)
          </div>
          <AnswerView answer={state.context.answer}/>
        </>
      )}
      {state.matches('play.night.end') && (
        <>
          <ImageWithTool>
            <WerewordImages.Logo/>
          </ImageWithTool>
          <div className={'text-center text-5xl w-max m-auto my-2 leading-normal'}>
            夜晚结束<br/>全体睁眼<br/>({state.context.leftSeconds}秒)
          </div>
        </>
      )}
    </div>
  );
};
