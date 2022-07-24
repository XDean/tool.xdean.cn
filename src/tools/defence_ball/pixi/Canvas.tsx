import { Game } from './game/game';
import { FC, useEffect, useRef } from 'react';
import * as pixi from 'pixi.js';
import * as c from './game/constants';

type Props = {
  game: Game
}

export const Canvas: FC<Props> = (
  {
    game,
  },
) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const app = new pixi.Application({
      backgroundColor: 0,
      width: c.width,
      height: c.height,
      resolution: 5,
      view: canvas.current!,
      powerPreference: 'high-performance',
    });

    const destroy = game.init(app);

    return () => {
      destroy();
      app.destroy(false, {
        children: true,
      });
    };
  }, [game]);
  return (
    <canvas ref={canvas}
            className={'absolute inset-0 w-full h-full'}
    />
  );
};