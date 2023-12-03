import { FC } from 'react';
import { Editor } from './components/Editor/Editor';

export const Home: FC = () => {
  return (
    <div className={'w-full h-screen grid grid-cols-2'}>
      <Editor/>
    </div>
  );
};