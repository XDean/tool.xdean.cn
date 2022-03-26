import {Tabs} from '@mantine/core';
import {useMemo} from 'react';
import {ALL_FANS, Fan} from '../core/fan';
import {groupBy} from '../../../../common/util/array';
import {HandView} from './unit/Hand';
import {TextWithTile} from './unit/TextWithTile';

export const FanTable = () => {
  const scoreToFans = useMemo(() => {
    const m = groupBy(ALL_FANS, e => e.score);
    return Array.from(m.keys())
      .sort((a, b) => b - a)
      .map(e => {
        const fans = m.get(e)!;
        return [e, fans] as [number, Fan[]];
      });
  }, []);
  return (
    <Tabs
      classNames={{
        tabLabel: 'whitespace-nowrap !text-right',
        tabActive: '!border-blue-400',
        tabInner: '!justify-end',
        tabControl: '!px-1 !py-2 !h-[auto]',
      }}>
      {scoreToFans.map(([score, fans]) => (
        <Tabs.Tab key={score} label={`${score}番`} classNames={{tabInner: 'whitespace-nowrap'}}>
          <div className={'space-y-4'}>
            {fans.map(e => (
              <div key={e.name}>
                <div className={'text-xl font-bold'}>
                  {e.name}
                </div>
                <div className={'ml-2 mt-1 space-y-1'}>
                  <TextWithTile text={e.desc} className={'text-lg'}/>
                  {e.sample && (
                    <div className={'space-y-1'}>
                      {e.sample.map((s, i) => (
                        <div key={i} className={'flex flex-col space-y-1'}>
                          {s.desc && <TextWithTile text={s.desc}/>}
                          <HandView value={s.hand}
                                    scale={0.7 - s.hand.mings.filter(e => e.type === 'gang').length * 0.05}/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};