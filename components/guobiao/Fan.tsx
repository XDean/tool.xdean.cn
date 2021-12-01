import {Fan, Hand, Hu} from 'lib/guobiao/type';
import {Fragment, useEffect, useState} from 'react';
import {Data} from 'common/util/base';
import {Loading} from 'common/components/Loading';
import {calcHu} from 'lib/guobiao/hu';
import {Tile} from 'lib/guobiao/tile';
import {calcTing} from 'lib/guobiao/ting';
import {TileView} from './Tile';

export const FanView = ({hand}: { hand: Hand }) => {
  const [hu, setHu] = useState<Data<Hu | Tile[]>>({type: 'null'});
  useEffect(() => {
    if (hand.count < 13) {
      setHu({type: 'null'});
      return;
    }
    setHu({type: 'loading'});

    if (hand.count === 13) {
      new Promise<Tile[]>(resolve => {
        resolve(calcTing(hand.tiles));
      })
        .then(tings => {
          if (tings.length === 0) {
            setHu({type: 'error', error: '没有听牌'});
          } else {
            setHu({type: 'ready', value: tings});
          }
        });
    } else if (hand.count === 14) {
      new Promise<Hu[]>(resolve => {
        resolve(calcHu(hand));
      })
        .then(hus => {
          if (hus.length === 0) {
            setHu({type: 'error', error: '诈和'});
          } else {
            const best = hus.reduce((a, b) => a.totalScore > b.totalScore ? a : b);
            setHu({type: 'ready', value: best});
          }
        });
    } else {
      setHu({type: 'error', error: '超过14张牌'});
    }
  }, [hand]);

  switch (hu.type) {
    case 'null':
      return <div className={'text-center text-2xl mt-2'}>请再选择{14 - hand.count}张牌</div>;
    case 'loading':
      return <div className={'text-center text-2xl mt-2'}>正在计算<Loading className={'w-16 h-16'}/></div>;
    case 'ready':
      const value = hu.value;
      if (value instanceof Array) {
        return (
          <div className={'text-center text-2xl mt-2 flex flex-col items-center'}>
            <div className={'mb-1'}>
              听 {value.length} 张牌
            </div>
            <div className={`grid auto-rows-auto gap-1 m-w-max`} style={{gridTemplateColumns: 'repeat(5, auto)'}}>
              {value.map(t => (
                <TileView tile={t} key={t.toNumber()}/>
              ))}
            </div>
          </div>
        );
      } else {
        const fanCounts = [] as [Fan, number][];
        value.fans.sort((a, b) => b.score - a.score)
          .forEach(f => {
            const find = fanCounts.find(r => r[0].name === f.name);
            if (!!find) {
              find[1]++;
            } else {
              fanCounts.push([f, 1]);
            }
          });
        return (
          <div className={'grid grid-cols-2 auto-rows-auto gap-x-2 text-2xl'}>
            {fanCounts.map((f, i) => (
              <Fragment key={i}>
                <div className={'text-right'}>{f[0].score}番</div>
                <div>{f[0].name}{f[1] > 1 ? ` × ${f[1]}` : ''}</div>
              </Fragment>
            ))}
            <div className={'text-right'}>共{value.totalScore}番</div>
            {value.totalScore - hand.option.hua < 8 && <div className={'text-2xl text-red-800'}>
              错和，未满8番
            </div>}
          </div>
        );
      }
    case 'error':
      return <div className={'text-center text-2xl mt-2'}>{hu.error}</div>;
  }
};