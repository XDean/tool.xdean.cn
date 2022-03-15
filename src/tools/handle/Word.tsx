import { useMemo } from 'react';
import { CharView } from './Char';
import { getWordPinYin, matchWord } from './util';

type Props = {
  word: string
  target?: string
}
export const WordView = (props: Props) => {
  const {word, target} = props;
  const wordPy = useMemo(() => getWordPinYin(word), [word]);
  const match = useMemo(() => target ? matchWord(wordPy, getWordPinYin(target)) : undefined, [wordPy, target]);
  return (
    <div className={'flex flex-row items-center space-x-2 select-none'}>
      {wordPy.map((e, idx) => (
        <CharView char={e} key={idx} match={match && match[idx]}/>
      ))}
    </div>
  );
};