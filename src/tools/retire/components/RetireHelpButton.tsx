import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import { HelpCircle } from 'lucide-react';
import Content from './RetireHelp.mdx';

export const RetireHelpButton = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className={'flex items-center gap-1 border border-gray-500 rounded-lg text-sm p-1'}
      >
        <HelpCircle size={16}/>
        帮助
      </button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="帮助"
      >
        <div
          className={'markdown-body'}
          style={{
            zoom: 0.75,
          }}
        >
          <Content/>
        </div>
      </Modal>
    </>
  );
};