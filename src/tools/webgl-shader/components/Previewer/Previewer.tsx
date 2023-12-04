import { FC, useEffect, useRef, useState } from 'react';
import { ThreeRenderer } from './render';

type Props = {
  fragShader: string
}
export const Previewer: FC<Props> = (
  {
    fragShader,
  },
) => {
  const renderer = useRef<ThreeRenderer>();
  const [rootDom, setRootDom] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootDom) {
      return;
    }
    renderer.current = new ThreeRenderer(rootDom);
    return () => {
      renderer.current?.dispose();
    };
  }, [rootDom]);

  useEffect(() => {
    renderer.current?.setFragmentShader(fragShader);
  }, [fragShader]);

  return (
    <div ref={setRootDom}
         className={'relative'}>

    </div>
  );
};