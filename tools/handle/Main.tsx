import { WordView } from './Word';

export const Handle = () => {
  return (
    <div className={'flex flex-col items-center'}>
      <WordView word={'一穷二白'} target={'穷困潦白'}/>
    </div>
  );
};