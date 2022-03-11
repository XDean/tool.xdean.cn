import { Button, TextInput } from '@mantine/core';
import { Idiom } from 'idiom';
import { useEffect, useMemo, useState } from 'react';
import { WordView } from './Word';

export const Handle = () => {
  const [answer, setAnswer] = useState<Idiom>();
  const [tries, setTries] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const acceptedInput = useMemo(() => Array.from(input).filter(i => /\p{Script=Han}/u.test(i)).slice(0, 4).join(''), [input]);

  useEffect(() => {
    fetch('/api/idiom?type=simple')
      .then<Idiom>(e => e.json())
      .then(setAnswer);
  }, []);

  const onConfirm = () => {
    if (acceptedInput.length >= 4) {
      tries.push(acceptedInput);
      setInput('');
    }
  };

  if (!answer) {
    return null;
  }
  return (
    <div className={'flex flex-col items-center space-y-2'}>
      {tries.map((e, i) => (
        <WordView key={i} word={e} target={answer.word}/>
      ))}
      <WordView word={(acceptedInput + '    ').slice(0, 4)}/>
      <TextInput value={input}
                 className={'w-full'}
                 onChange={e => setInput(e.currentTarget.value)}
                 onKeyPress={e => {
                   if (e.key === 'enter') {
                     onConfirm();
                   }
                 }}
      />
      <Button onClick={onConfirm}>
        确认
      </Button>
    </div>
  );
};