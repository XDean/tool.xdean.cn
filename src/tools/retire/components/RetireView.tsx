import { useState } from 'react';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { Retire, RetireRes } from '../model/retire';
import { RetireInputForm } from './RetireInputForm';
import { RetireResView } from './RetireResView';
import { Button } from '@mantine/core';

export const RetireView = () => {
  const [input, setInput] = useState(Retire.defaultInput());
  const [res, setRes] = useState<RetireRes>();
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
          }}
        />
        <div className={'text-center'}>
          <Button
            onClick={() => {
              try {
                setRes(Retire.calc(input));
              } catch (e) {
                //TODO
                setRes(undefined);
              }
            }}
          >
            计算退休！！！
          </Button>
        </div>

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