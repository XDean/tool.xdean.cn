import { useState } from 'react';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { Retire, RetireRes } from '../model/retire';
import { RetireInputForm } from './RetireInputForm';
import { RetireResView } from './RetireResView';
import { Button } from '@mantine/core';
import { Achievement, BPZJ, calcAchievement } from '../model/achievement';
import { AchievementView } from './AchievementView';

export const RetireView = () => {
  const [input, setInput] = useState(Retire.defaultInput());
  const [res, setRes] = useState<RetireRes>();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  return (
    <ToolLayout
      nav={{
        title: '退休计算器',
      }}
      ads={false}
    >
      <div
        className={'text-sm space-y-2'}
      >
        <RetireInputForm
          value={input}
          onChange={(v) => {
            setInput(v);
            setRes(undefined);
            setAchievements([])
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

        {achievements.length > 0 && <AchievementView achievements={achievements} />}

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

      </div>
    </ToolLayout>
  );
};