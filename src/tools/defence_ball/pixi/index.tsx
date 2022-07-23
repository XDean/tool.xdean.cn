import { useEffect, useRef, useState } from 'react';
import * as pixi from 'pixi.js';
import { SizeMe } from 'react-sizeme';
import * as c from './game/constants';
import { Game } from './game/game';
import { Start } from './Start';

export const GameView = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [game] = useState(() => new Game());
  useEffect(() => {
    const app = new pixi.Application({
      backgroundColor: 0,
      width: c.width,
      height: c.height,
      resolution: 5,
      view: canvas.current!,
    });

    app.stage.addChild(game.object);

    return () => {
      app.destroy();
    };
  });
  return (
    <SizeMe monitorHeight>
      {({size: {width, height}}) => {
        const w = Math.min(width ?? Infinity, (height ?? Infinity) * c.width / c.height);
        return (
          <div className={'w-screen h-screen flex items-center justify-center'}>
            <div
              className={'relative bg-black'}
              style={{
                width: w,
                height: w * c.height / c.width,
              }}>
              <canvas ref={canvas}
                      className={'w-full h-full'}
              />
              <div className={'absolute inset-0'}>
                <Start onStart={() => {
                  game.newGame();
                }}/>
              </div>
            </div>
          </div>
        );
      }}
    </SizeMe>
  );
};