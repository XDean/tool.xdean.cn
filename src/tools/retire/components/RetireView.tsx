import React, { useRef, useState } from 'react';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { Retire, RetireRes } from '../model/retire';
import { RetireInputForm } from './RetireInputForm';
import { RetireResView } from './RetireResView';
import { Button } from '@mantine/core';
import { Achievement, BPZJ, calcAchievement } from '../model/achievement';
import { AchievementView } from './AchievementView';
import { RetireHelpButton } from './RetireHelpButton';
import { ReadWithAPI } from '../../../../common/components/badge/Read';
import { LikeWithAPI } from '../../../../common/components/badge/Like';
import { GithubComment } from '../../../components/util/GithubComment';
import { usePrevious } from 'react-use';
import { Undo2 } from 'lucide-react';
import clsx from 'clsx';

export const RetireView = () => {
  const [input, setInput] = useState(Retire.defaultInput());
  const [res, setRes] = useState<RetireRes>();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const commentRef = useRef<HTMLDivElement>(null);
  const prevInput = usePrevious(input);

  return (
    <ToolLayout
      nav={{
        title: '退休计算器',
        left: (
          <button
            onClick={() => prevInput && setInput(prevInput)}
            className={clsx(
              'flex items-center gap-1 border border-gray-500 rounded-lg text-sm p-1',
              !prevInput && 'hidden',
            )}
          >
            <Undo2 size={16}/>
            撤销
          </button>
        ),
        right: <RetireHelpButton/>,
      }}
      ads={false}
    >
      <div className={'text-sm space-y-2'}>
        <div className={'space-x-2 flex items-center justify-center w-full'}>
          <ReadWithAPI id={`tool:retire`} name={'访问'}/>
          <LikeWithAPI id={`tool:retire`}/>
        </div>
        <hr/>
        <RetireInputForm
          value={input}
          onChange={(v) => {
            setInput(v);
            setRes(undefined);
            setAchievements([]);
          }}
        />
        <div className={'text-center'}>
          <Button
            onClick={() => {
              try {
                const r = Retire.calc(input);
                setRes(r);
                setAchievements(calcAchievement(input, r));
              } catch (e) {
                console.error(e);
                setRes(undefined);
                setAchievements([BPZJ]);
              }
            }}
          >
            计算退休！！！
          </Button>
        </div>

        {achievements.length > 0 && <AchievementView achievements={achievements}/>}

        {res && (
          <div ref={(e) => {
            if (e) {
              e.scrollIntoView({
                behavior: 'smooth',
              });
            }
          }}>
            <RetireResView
              input={input}
              res={res}
            />
          </div>
        )}
        <hr/>
        <div className={'w-full'} ref={commentRef}>
          <GithubComment/>
        </div>
      </div>
    </ToolLayout>
  );
};