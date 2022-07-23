import { useState } from 'react';
import { SizeMe } from 'react-sizeme';
import * as c from './game/constants';
import { Game } from './game/game';
import { Controller } from './Controller';
import { Canvas } from './Canvas';

export const GameView = () => {
  const [game, setGame] = useState(() => new Game());
  return (
    <SizeMe monitorHeight>
      {({size: {width, height}}) => {
        const w = Math.min(width ?? Infinity, (height ?? Infinity) * c.width / c.height);
        return (
          <div className={'w-screen h-screen flex items-center justify-center'}>
            <button onClick={() => setGame(new Game())}>
              new
            </button>
            <div
              className={'relative bg-black'}
              style={{
                width: w,
                height: w * c.height / c.width,
              }}>
              <Canvas game={game}/>
              <Controller game={game}/>
            </div>
          </div>
        );
      }}
    </SizeMe>
  );
};