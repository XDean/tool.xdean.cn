import { Button, Modal, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
import { VscDebugRestart, VscNotebook } from 'react-icons/vsc';
import { Game } from '../game';
import { filter4ChineseChar } from '../util';
import { CheatSheet } from './CheatSheet';
import { IdiomHint } from './IdiomHint';
import { WordView } from './Word';

type Props = {
  game: Game
  onRestart: () => void
}

export const GameView = observer((props: Props) => {
  const {game, onRestart} = props;
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const acceptedInput = useMemo(() => filter4ChineseChar(input), [input]);
  const [showHint, setShowHint] = useState(false);
  const [showCheat, setShowCheat] = useState(false);

  const onConfirm = () => {
    if (!game.correct && acceptedInput.length === 4) {
      game.guess(acceptedInput);
      setInput('');
    }
  };

  useEffect(() => {
    if (showHint) {
      game.useHint = true;
    }
  }, [showHint]);

  return (
    <div className={'flex flex-col items-center mx-auto'}>
      <div className={'flex flex-col items-center space-y-2 w-min relative'}>
        <div className={'w-full text-gray-400 flex flex-row items-center justify-between'}>
          <div>题号：{game.details?.id ?? '自定义'}</div>
          <div onClick={onRestart}
               className={'select-none flex flex-row items-center cursor-pointer hover:text-black'}>
            <VscDebugRestart size={16}/>
            <div>换一题</div>
          </div>
        </div>
        {game.tries.map((e, i) => (
          <WordView key={i} word={e} target={game.answer}/>
        ))}
        {game.correct ? (
          <div className={'flex flex-col items-center space-y-2'}>
            <div className={'flex flex-rol items-center space-x-4 text-gray-500'}>
              <div>
                {game.useHint ? '有提示' : '无提示'}
              </div>
              <div>
                {game.totalTimeStr}
              </div>
            </div>
            <Button onClick={onRestart}>
              再来一次
            </Button>
            <div className={'m-2'}>
              {game.details && <IdiomHint idiom={game.details}/>}
            </div>
          </div>
        ) : (
          <>
            <div onClick={() => inputRef.current?.focus()}>
              <WordView word={(acceptedInput + '    ').slice(0, 4)}/>
            </div>
            <TextInput value={input}
                       ref={inputRef}
                       className={'w-full'}
                       classNames={{
                         input: '!text-center',
                       }}
                       placeholder={'请输入四字成语'}
                       size={'lg'}
                       onChange={e => setInput(e.currentTarget.value)}
                       onKeyPress={e => {
                         if (e.key === 'Enter') {
                           onConfirm();
                         }
                       }}
            />
            <Button onClick={onConfirm}
                    disabled={acceptedInput.length !== 4}>
              确认
            </Button>
            <hr className={'w-full'}/>
            <div className={'mx-auto flex flex-row items-center space-x-4'}>
              {game.details ? (
                <div onClick={() => setShowHint(true)}
                     className={'text-gray-400 select-none flex flex-row items-center cursor-pointer hover:text-black'}>
                  <FaRegLightbulb size={16}/>
                  <div>提示</div>
                </div>
              ) : <div/>}
              <div onClick={() => setShowCheat(true)}
                   className={'text-gray-400 select-none flex flex-row items-center cursor-pointer hover:text-black'}>
                <VscNotebook size={16}/>
                <div>速查表</div>
              </div>
            </div>
          </>
        )}
      </div>
      {game.details && (
        <Modal opened={showHint}
               onClose={() => setShowHint(false)}
               hideCloseButton
               onClick={() => setShowHint(false)}
               title={(
                 <div className={'flex items-center space-x-2'}>
                   <FaRegLightbulb size={20}/>
                   <div>提示</div>
                 </div>
               )}>
          <IdiomHint idiom={game.details}/>
        </Modal>
      )}
      <Modal opened={showCheat}
             onClose={() => setShowCheat(false)}
             hideCloseButton
             transition={'pop-bottom-left'}
             onClick={() => setShowCheat(false)}
             title={(
               <div className={'flex items-center space-x-2'}>
                 <VscNotebook size={20}/>
                 <div>速查表</div>
               </div>
             )}>
        <CheatSheet game={game}/>
      </Modal>
    </div>
  );
});