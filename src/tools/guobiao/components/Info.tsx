import { Tabs } from '@mantine/core';
import Help from './help.mdx';

export const Info = () => {
  return (
    <Tabs>
      <Tabs.Tab label={'简介'}>
        <Help/>
      </Tabs.Tab>
      <Tabs.Tab label={'番表'}>

      </Tabs.Tab>
      <Tabs.Tab label={'日志'}>

      </Tabs.Tab>
    </Tabs>
  );
};