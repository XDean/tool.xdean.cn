import { Char } from './domain';
import { WordView } from './Word';

const char: Char = {
  value: '百',
  shengMu: 'b',
  yunMu: 'ai',
  yinDiao: 3,
  yinDiaoPos: 0,
};
export const Handle = () => {
  return (
    <div>
      <WordView word={[char, char, char, char]}/>
    </div>
  );
};