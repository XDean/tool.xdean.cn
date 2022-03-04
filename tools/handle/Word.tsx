import { CharView } from './Char';
import { Word } from './domain';

type Props = {
  word: Word
}
export const WordView = (props: Props) => {
  const {word} = props;
  return (
    <div className={'flex flex-row items-center space-x-2'}>
      {word.map((e, idx) => (
        <CharView char={e} key={idx}/>
      ))}
    </div>
  );
};