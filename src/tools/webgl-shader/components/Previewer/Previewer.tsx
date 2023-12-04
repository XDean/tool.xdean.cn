import {useEffect, useState} from 'react';
import {ThreeRenderer} from './render';

export const Previewer = () => {
  const [rootDom, setRootDom] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootDom) {
      return;
    }
    const renderer = new ThreeRenderer(rootDom);
    return () => {
      renderer.dispose();
    };
  }, [rootDom]);

  return (
    <div ref={setRootDom}
         className={'relative'}>

    </div>
  );
};