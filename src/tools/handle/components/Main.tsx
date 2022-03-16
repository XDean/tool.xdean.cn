import { Button, Loader, TextInput } from '@mantine/core';
import { Idiom } from 'idiom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaRegLightbulb } from 'react-icons/fa';
import { WordView } from './Word';

export const HandleMain = () => {
  const [answer, setAnswer] = useState<Idiom>();
  const [tries, setTries] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const acceptedInput = useMemo(() => Array.from(input).filter(i => /\p{Script=Han}/u.test(i)).slice(0, 4).join(''), [input]);
  const [correct, setCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDetails, setShowDetails] = useState(false);

  const onConfirm = () => {
    if (!correct && acceptedInput.length === 4) {
      if (acceptedInput === answer?.word) {
        setCorrect(true);
      }
      tries.push(acceptedInput);
      setInput('');
    }
  };

  const onRetry = useCallback(() => {
    setAnswer(undefined);
    fetch('/api/idiom?type=simple')
      .then<Idiom>(e => e.json())
      .then(setAnswer);
    setCorrect(false);
    setInput('');
    setTries([]);
    setShowDetails(false);
  }, []);

  useEffect(() => {
    onRetry();
  }, [onRetry]);


  if (!answer) {
    return <Loader className={'mx-auto'}/>;
  }
  return (
    <div className={'flex flex-col items-center mx-auto'}>
      <div className={'flex flex-col items-center space-y-2  w-max'}>
        {tries.map((e, i) => (
          <WordView key={i} word={e} target={answer.word}/>
        ))}
        {correct ? (
          <div>
            <Button onClick={onRetry}>
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
              <div onClick={() => setShowDetails(d => !d)}
                   className={'text-gray-400 select-none flex flex-row items-center cursor-pointer hover:text-black'}>
                <FaRegLightbulb size={16}/>
                <div>{showDetails ? '关闭' : '显示'}提示</div>
              </div>
              <div onClick={() => onRetry()}
                   className={'text-gray-400 select-none flex flex-row items-center cursor-pointer hover:text-black'}>
                <VscDebugRestart size={16}/>
                <div>换一题</div>
              </div>
            </div>
          </>
        )}
      </div>
      {(showDetails || correct) && (
        <div className={'text-gray-600 mt-4'}>
          <div className={'flex flex-start'}>
            <div className={'font-bold whitespace-nowrap'}>出处：</div>
            <div>{answer.derivation.replace(answer.word, '~')}</div>
          </div>
          <div className={'flex flex-start'}>
            <div className={'font-bold whitespace-nowrap'}>示例：</div>
            <div>{answer.example.replace(answer.word, '～')}</div>
          </div>
        </div>
      )}
    </div>
  );
};