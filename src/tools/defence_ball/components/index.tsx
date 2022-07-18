import { useEffect, useRef } from 'react';
import { newGame } from './game';

export const DefenceBall = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      return newGame(container.current);
    }
  }, []);


  return (
    <div
      ref={container}
      className={'w-screen h-screen flex flex-row items-center justify-center'}
    >
    </div>
  );
};