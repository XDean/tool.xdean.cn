import { Loader } from '@mantine/core';
import { Fragment } from 'react';
import { calcHuBest } from 'src/tools/guobiao/core/hu';
import { Tile } from 'src/tools/guobiao/core/tile';
import { calcTing } from 'src/tools/guobiao/core/ting';
import { Fan, Hand, Hu } from 'src/tools/guobiao/core/type';
import { useSWROnce } from '../../../../common/util/swr';
import { TileView } from './Tile';

export const FanView = ({hand}: { hand: Hand }) => {
  const result = useSWROnce(['guobiao:hu', hand], {
    shouldRetryOnError: false,
    fetcher: async (_, hand) => {
      if (hand.count < 13) {
        return `请再选择${14 - hand.count}张牌`;
      }
      if (hand.count === 13) {
        const tings = calcTing(hand.tiles);
        const hus = tings.map(t => {
          const h = hand.copy();
          h.tiles.tiles.push(t);
          return [t, calcHuBest(h)!] as [Tile, Hu];
        });
        if (hus.length === 0) {
          return '没有听牌';
        } else {
          return hus;
        }
      } else if (hand.count === 14) {
        const hu = calcHuBest(hand);
        if (hu === null) {
          return '诈和';
        } else {
          return hu;
        }
      } else {
        return '超过14张牌';
      }
    },
  });
  if (result.data === undefined) {
    return <Loader className={'mx-auto'}/>;
  }
  if (typeof result.data === 'string') {
    return (
      <div className={'text-center text-2xl'}>
        {result.data}
      </div>
    );
  } else if (result.data instanceof Array) {
    return (
      <div className={'text-center mt-2 flex flex-col items-center'}>
        <div className={'mb-1 text-2xl'}>
          听 {result.data.length} 张牌
        </div>
        <div className={`flex flex-row flex-wrap text-sm lg:text-lg`}>
          {result.data.map(([t, h]) => (
            <div className={'m-1 flex flex-col items-center'} key={t.toNumber()}>
              <div>{h.totalScore}番</div>
              <TileView tile={t}/>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    const fanCounts = [] as [Fan, number][];
    result.data.fans.sort((a, b) => b.score - a.score)
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
        <div className={'text-right'}>共{result.data.totalScore}番</div>
        {result.data.totalScore - hand.option.hua < 8 && <div className={'text-2xl text-red-800'}>
          错和，未满8番
        </div>}
      </div>
    );
  }
};