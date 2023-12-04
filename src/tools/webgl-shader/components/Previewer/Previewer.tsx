import { FC, useEffect, useState } from 'react';
import { ThreeRenderer } from './render';

type Props = {
  vertexShader: string
  fragShader: string
}
export const Previewer: FC<Props> = (
  {
    vertexShader,
    fragShader,
  },
) => {
  const [renderer, setRenderer] = useState<ThreeRenderer>();
  const [rootDom, setRootDom] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootDom) {
      return;
    }
    const r = new ThreeRenderer(rootDom);
    setRenderer(r);
    return () => {
      r.dispose();
    };
  }, [rootDom]);

  useEffect(() => {

  }, [renderer]);

  useEffect(() => {
    renderer?.setVertexShader(vertexShader);
  }, [renderer, vertexShader]);


  useEffect(() => {
    renderer?.setFragmentShader(fragShader);
  }, [renderer, fragShader]);

  return (
    <div className={'full flex flex-col'}>
      <div ref={setRootDom}
           className={'aspect-square max-w-full max-h-full'}
      />
    </div>
  );
};