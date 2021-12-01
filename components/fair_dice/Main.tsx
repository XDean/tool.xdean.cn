import React, {useCallback, useMemo, useState} from 'react';
import {createFairRandomContext, diceNumberToArray} from './domain';
import {Die} from './Die';
import useSound from 'use-sound';
import random from 'random';
import {DiceTable} from './DiceTable';
import {DiceChart} from './DiceChart';

export const Main = () => {
  const [count, setCount] = useState(2);
  const [fairFactor, setFairFactor] = useState(0);
  const [dice, setDice] = useState([0, 0]);
  const [history, setHistory] = useState<number[][]>([]);
  const [playSound] = useSound('/tool/fair_dice/die.mp3');
  const context = useMemo(() => createFairRandomContext(Math.pow(6, count), fairFactor / 100), [fairFactor, count]);


  const roll = (total: number = 1) => {
    playSound();
    let times = 0;
    const intervalId = setInterval(() => {
      times++;
      if (times < 10) {
        setDice(diceNumberToArray(count, random.int(0, Math.pow(6, count))));
      } else {
        clearInterval(intervalId);
        const res = [...Array(total).keys()].map(() => diceNumberToArray(count, context.next()));
        setHistory(h => [...h, ...res]);
        setDice(res[res.length - 1]);
      }
    }, 50);
  };

  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <div className={'w-full flex flex-col items-center space-y-4'}>
      <div className={'italic text-sm text-gray-500'}>
        公平，公平，还是 XX 的公平
      </div>
      <div className={'grid grid-cols-1 gap-y-2 text-2xl'}>
        <div className={'flex flex-row items-center'}>
          <div>骰子数量：{' '}</div>
          <select className={'border border-blue-400 rounded-md px-2 w-24'} value={count}
                  onChange={e => setCount(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div className={'flex flex-row items-center w-'}>
          <div>公平程度：{' '}</div>
          <input type={'range'} className={'w-32'} value={fairFactor}
                 onChange={e => setFairFactor(Number(e.target.value))}/>
          <div className={'ml-1 w-8'}>
            {fairFactor}%
          </div>
        </div>
        <div className={'mt-2 text-center'}>
          <button className={'px-4 bg-blue-600 text-white hover:bg-blue-500 btn'}
                  onClick={() => roll()}
          >
            掷{' '}骰{' '}子
          </button>
        </div>
      </div>
      <div className={'flex flex-row items-center justify-center'}>
        {dice.map((d, i) => (
          <div key={i} className={'m-2'}>
            <Die value={d}/>
          </div>
        ))}
      </div>
      <div className={'space-x-4'}>
        <button onClick={clearHistory} className={'btn'}>
          清空记录
        </button>
        <button className={'btn'}
                onClick={() => roll(Math.pow(6, count))}
        >
          掷 {Math.pow(6, count)} 次
        </button>
      </div>
      <div className={'pl-4 flex flex-row w-full max-h-72 lg:max-h-96 justify-center'}>
        <div className={'min-w-24'}>
          <DiceTable values={history}/>
        </div>
        <div className={'flex-grow max-w-md w-0'}>
          <DiceChart values={history}/>
        </div>
      </div>
    </div>
  );
};