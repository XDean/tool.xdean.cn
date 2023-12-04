import { FC, useState } from 'react';
import { Editor } from './components/Editor/Editor';
import { Previewer } from './components/Previewer/Previewer';
import { BasicShader, VertexShader } from './components/shaders/plane';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

export const Home: FC = () => {
  const [vertexShader, setVertexShader] = useState(VertexShader);
  const [fragShader, setFragShader] = useState(BasicShader);
  return (
    <div className={'w-full h-screen'}>
      <Allotment defaultSizes={[2, 1]}>
        <Allotment
          vertical
        >
          <Editor value={vertexShader} onChange={setVertexShader}/>
          <Editor value={fragShader} onChange={setFragShader}/>
        </Allotment>
        <Previewer vertexShader={vertexShader} fragShader={fragShader}/>
      </Allotment>
    </div>
  );
};