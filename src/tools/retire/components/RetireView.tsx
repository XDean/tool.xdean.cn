import React, { useRef, useState } from 'react';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { Retire, RetireRes } from '../model/retire';
import { RetireInputForm } from './RetireInputForm';
import { RetireResView } from './RetireResView';
import { Button } from '@mantine/core';
import { Achievement, BPZJ, calcAchievement } from '../model/achievement';
import { AchievementView } from './AchievementView';
import { RetireHelpDialog } from './RetireHelpDialog';
import { ReadWithAPI } from '../../../../common/components/badge/Read';
import { GuoBiao } from '../../guobiao';
import { LikeWithAPI } from '../../../../common/components/badge/Like';
import { GithubComment } from '../../../components/util/GithubComment'; // 新增：引入帮助对话框组件

export const RetireView = () => {
  const [input, setInput] = useState(Retire.defaultInput());
  const [res, setRes] = useState<RetireRes>();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <ToolLayout
      nav={{
        title: '退休计算器',
        right: <RetireHelpDialog/>, // 修改：使用帮助对话框组件
      }}
      ads={false}
    >
      <div className={'text-sm space-y-2'}>
        <div className={'space-x-2 flex items-center justify-center w-full'}>
          <ReadWithAPI id={`tool:${GuoBiao.id}`} name={'访问'}/>
          <LikeWithAPI id={`tool:${GuoBiao.id}`}/>
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