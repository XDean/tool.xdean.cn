import {useService} from '@xstate/react';
import {WerewordImages} from './Images';
import {WerewordContext, WerewordEvent, WerewordSchema} from '../machine';
import {Interpreter} from 'xstate';
import {Loading} from '../../../common/components/Loading';

export const WerewordSetup = ({service}: { service: Interpreter<WerewordContext, WerewordSchema, WerewordEvent> }) => {
  const [state, send] = useService(service);

  return (
    <>
      <WerewordImages.Logo/>
      <div className={'text-2xl mb-4 mt-2 text-center'}>请先购买正版《狼人真言》<br/>然后搭配使用本工具进行游戏</div>
      {state.matches('setup.prepare') && (
        <div className={'flex flex-col items-center text-4xl'}>
          <div>正在加载</div>
          <Loading className={'h-12 w-12 text-blue-500 mt-2'}/>
        </div>
      )}
      {state.matches('setup.waiting') && (
        <div>
          <button className={'btn-contain text-3xl text-center block m-auto'}
                  onClick={() => send('START')}>
            开始游戏
          </button>
          <div className={'border my-4 p-2 w-max m-auto'}>
            <div className={'text-2xl mb-1'}>选择词库</div>
            <div className={'grid grid-cols-4'}>
              {state.context.allWordSet.map(s => (
                <div key={s.id} className={'inline-flex items-center mx-2 my-1'}>
                  <input type="checkbox" checked={state.context.wordSet.indexOf(s) !== -1}
                         onChange={e => send(({type: 'SELECT_WORD_SET', value: s, check: e.target.checked}))}
                         className="h-6 w-6"/>
                  <span className={'ml-1'}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};