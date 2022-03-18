import { Button, Modal, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo, useRef, useState } from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
import { VscDebugRestart } from 'react-icons/vsc';
import { Game } from '../game';
import { WordView } from './Word';

type Props = {
  game: Game
  onRestart: () => void
}

export const GameView = observer((props: Props) => {
  const {game, onRestart} = props;
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const acceptedInput = useMemo(() => Array.from(input).filter(i => /\p{Script=Han}/u.test(i)).slice(0, 4).join(''), [input]);
  const [showHint, setShowHint] = useState(false);

  const onConfirm = () => {
    if (!game.correct && acceptedInput.length === 4) {
      game.guess(acceptedInput);
      setInput('');
    }
  };

  return (
    <div className={'flex flex-col items-center mx-auto'}>
      <div className={'flex flex-col items-center space-y-2  w-max'}>
        {game.tries.map((e, i) => (
          <WordView key={i} word={e} target={game.answer}/>
        ))}
        {game.correct ? (
          <div>
            <Button onClick={onRestart}>
              再来一次
            </Button>
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
            <div className={'w-full flex flex-row items-center justify-between'}>
              <div onClick={() => setShowHint(true)}
                   className={'text-gray-400 select-none flex flex-row items-center cursor-pointer hover:text-black'}>
                <FaRegLightbulb size={16}/>
                <div>提示</div>
              </div>
              <div onClick={onRestart}
                   className={'text-gray-400 select-none flex flex-row items-center cursor-pointer hover:text-black'}>
                <VscDebugRestart size={16}/>
                <div>换一题</div>
              </div>
            </div>
          </>
        )}
      </div>
      <Modal opened={showHint}
             onClose={() => setShowHint(false)}
             hideCloseButton
             title={(
               <div className={'flex items-center space-x-2'}>
                 <FaRegLightbulb size={20}/>
                 <div>提示</div>
               </div>
             )}>
        {game.details && (
          <div className={'text-gray-600 mt-4'}>
            <div className={'flex flex-start'}>
              <div className={'font-bold whitespace-nowrap'}>出处：</div>
              <div>{game.details.derivation.replace(game.answer, '～')}</div>
            </div>
            <div className={'flex flex-start'}>
              <div className={'font-bold whitespace-nowrap'}>示例：</div>
              <div>{game.details.example.replace(game.answer, '～')}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
});