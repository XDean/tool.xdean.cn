import { useState } from 'react';
import { ActionIcon, Modal } from '@mantine/core';
import { HelpCircle } from 'lucide-react';
import Content from './RetireHelp.mdx';

export const RetireHelpDialog = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <ActionIcon onClick={() => setOpened(true)}>
        <HelpCircle/>
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="帮助"
      >
        <div
          className={'markdown-body'}
          style={{
            zoom: 0.75
          }}
        >
          <Content/>
        </div>
      </Modal>
    </>
  );
};