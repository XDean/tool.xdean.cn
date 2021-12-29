import {Interpreter} from "xstate";
import {WerewordContext, WerewordEvent, WerewordSchema} from "../machine";
import {useService} from "@xstate/react";

export const WerewordToolbar = ({service}: { service: Interpreter<WerewordContext, WerewordSchema, WerewordEvent> }) => {
  const [state, send] = useService(service)
  return (
    <div className={'grid grid-cols-1 gap-1'}>
      {state.matches('play') && (
        <>
          <button onClick={() => send('STOP')}>停止</button>
          {state.context.leftSeconds > 0 && (
            <>
              <button onClick={() => send('TICK_ALL')}>快进</button>
              <button onClick={() => send('PAUSE')}>{state.context.pause ? '继续' : '暂停'}</button>
            </>
          )}
        </>
      )}
    </div>
  )
}