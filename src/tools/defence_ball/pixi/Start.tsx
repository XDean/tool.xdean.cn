import { ReadWithAPI } from '../../../../common/components/badge/Read';
import { LikeWithAPI } from '../../../../common/components/badge/Like';
import React, { FC, useState } from 'react';
import { DefenceBall } from '../index';
import { useAnimationFrame } from '../../../../common/util/hook';
import { flip } from '../util';
import { Game } from './game/game';

type Props = {
  game: Game
}

export const Start: FC<Props> = (
  {
    game,
  },
) => {
  return (
    <div className={'text-center text-white mt-[30%]'}>
      <div className={'text-6xl mb-16'}>
        防守球游戏
      </div>
      <button className={'text-3xl border border-white rounded p-2 hover:bg-white hover:text-black transition'}
              onClick={() => game.newGame()}
      >
        开始游戏
      </button>
      <div className={'space-x-2 mt-8'}>
        <ReadWithAPI id={`tool:${DefenceBall.id}`} name={'访问'}/>
        <LikeWithAPI id={`tool:${DefenceBall.id}`}/>
      </div>
      <div className={'w-max m-auto mt-16'}>
        <Anim/>
      </div>
    </div>
  );
};

const Anim = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [y, setY] = useState(100); //50-150
  useAnimationFrame((delta) => {
    const d = delta / 2;
    let ny = y + d * (count1 > count2 ? 1 : -1);
    while (true) {
      if (ny > 150) {
        setCount2(c => c + 1);
        ny = flip(ny, 150);
      } else if (ny < 50) {
        setCount1(c => c + 1);
        ny = flip(ny, 50);
      } else {
        break;
      }
    }
    setY(ny);
  });
  return (
    <svg width={200} height={200} className={'font-sans'}>
      <rect x={80} y={0} width={40} height={40} fill={'red'}/>
      <text x={100} y={20} textAnchor={'middle'} dominantBaseline={'central'} fill={'white'}
            fontSize={fontSize(count1)}>
        {count1}
      </text>
      <rect x={80} y={160} width={40} height={40} fill={'red'}/>
      <text x={100} y={180} textAnchor={'middle'} dominantBaseline={'central'} fill={'white'}
            fontSize={fontSize(count2)}>
        {count2}
      </text>
      <circle cx={100} cy={y} r={10} fill={'white'}/>
    </svg>
  );
};

function fontSize(value: number) {
  const width = 30;
  return Math.min(25, Math.floor(Math.min(width, width * 2 / value.toString().length)));
}