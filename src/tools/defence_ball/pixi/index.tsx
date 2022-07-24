import { useState } from 'react';
import { SizeMe } from 'react-sizeme';
import * as c from './game/constants';
import { Game } from './game/game';
import { Controller } from './Controller';
import { Canvas } from './Canvas';
import { Score } from './Score';

export const GameView = () => {
  const [game, setGame] = useState(() => new Game());
  return (
    <SizeMe monitorHeight>
      {({size: {width, height}}) => {
        const topHeight = 100;
        const w = Math.min(width ?? Infinity, ((height ?? Infinity) - topHeight) * c.width / c.height);
        return (
          <div className={'w-screen h-screen flex flex-col items-center justify-center'}>
            <div style={{
              width: w,
              height: topHeight,
            }}>
              <Score game={game}/>
            </div>
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