import {FC} from 'react';
import {Editor} from './components/Editor/Editor';
import {Previewer} from './components/Previewer/Previewer';

export const Home: FC = () => {
  return (
    <div className={'w-full h-screen grid grid-cols-2'}>
      <Editor/>
      <Previewer/>
    </div>
  );
};