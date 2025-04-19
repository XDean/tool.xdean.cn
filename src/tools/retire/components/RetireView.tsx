import { useState } from 'react';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { Retire } from '../model/retire';
import { RetireInputForm } from './RetireInputForm';
import { Button } from '@mantine/core';

export const RetireView = () => {
  const [input, setInput] = useState(Retire.defaultInput());
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
          onChange={setInput}
        />
        <div className={'text-center'}>
          <Button>
            计算退休！！！
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
};