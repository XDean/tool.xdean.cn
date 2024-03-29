import { ReadWithAPI } from '../../../../common/components/badge/Read';
import { LikeWithAPI } from '../../../../common/components/badge/Like';
import React, { FC, useState } from 'react';
import { DefenceBall } from '../index';
import { useAnimationFrame } from '../../../../common/util/hook';
import { flip } from '../util';
import { Game } from './game/game';
import { observer } from 'mobx-react-lite';

type Props = {
  game: Game
}

export const Start: FC<Props> = observer((
  {
    game,
  },
) => {
  return (
    <div className={'flex flex-col items-center text-white mt-[10%] md:mt-[20%]'}>
      <div className={'text-6xl mb-6 md:mb-16'}>
        防守球游戏
      </div>
      <button className={'text-3xl border border-white rounded p-2 hover:bg-white hover:text-black transition'}
              onClick={() => game.newGame()}
      >
        开始游戏
      </button>
      <select
        className={'block bg-black border mt-2 rounded'}
        value={game.mode}
        onChange={e => game.mode = e.currentTarget.value as any}
      >
        <option value={'normal'}>普通模式</option>
        <option value={'xuxu'}>栩栩模式</option>
      </select>
      <div className={'space-x-2 mt-8'}>
        <ReadWithAPI id={`tool:${DefenceBall.id}`} name={'访问'}/>
        <LikeWithAPI id={`tool:${DefenceBall.id}`}/>
      </div>
      <div className={'w-max m-auto mt-6 md:mt-16'}>
        <Anim/>
      </div>
    </div>
  );
});

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