import { Button, TextInput } from '@mantine/core';
import { Idiom } from 'idiom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loading } from '../../common/components/Loading';
import { WordView } from './Word';

export const Handle = () => {
  const [answer, setAnswer] = useState<Idiom>();
  const [tries, setTries] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const acceptedInput = useMemo(() => Array.from(input).filter(i => /\p{Script=Han}/u.test(i)).slice(0, 4).join(''), [input]);
  const [correct, setCorrect] = useState(false);

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
  }, []);

  useEffect(() => {
    onRetry();
  }, [onRetry]);


  if (!answer) {
    return <Loading/>;
  }
  return (
    <div className={'flex flex-col items-center space-y-2 w-max mx-auto'}>
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
          <WordView word={(acceptedInput + '    ').slice(0, 4)}/>
          <TextInput value={input}
                     className={'w-full'}
                     classNames={{
                       input: '!text-center',
                     }}
                     placeholder={'请输入四字成语'}
                     size={'lg'}
                     onChange={e => setInput(e.currentTarget.value)}
                     onKeyPress={e => {
                       console.log(e);
                       if (e.key === 'Enter') {
                         onConfirm();
                       }
                     }}
          />
          <Button onClick={onConfirm}
                  disabled={acceptedInput.length !== 4}>
            确认
          </Button>
        </>
      )}
    </div>
  );
};