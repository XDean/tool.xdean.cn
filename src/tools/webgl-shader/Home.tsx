import { FC, useState } from 'react';
import { Editor } from './components/Editor/Editor';
import { Previewer } from './components/Previewer/Previewer';

export const Home: FC = () => {
  const [fragShader, setFragShader] = useState('');
  return (
    <div className={'w-full h-screen grid grid-cols-2'}>
      <Editor fragShader={fragShader} onFragShaderChange={setFragShader}/>
      <Previewer fragShader={fragShader}/>
    </div>
  );
};