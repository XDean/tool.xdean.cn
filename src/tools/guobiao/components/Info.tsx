import {Tabs} from '@mantine/core';
import Help from './help.mdx';
import Update from './update.mdx';
import {FanTable} from './FanTable';

export const Info = () => {
  return (
    <Tabs className={'w-full'}
          position={'center'}
    >
      <Tabs.Tab label={'简介'}>
        <div className={'markdown-body'}>
          <Help/>
        </div>
      </Tabs.Tab>
      <Tabs.Tab label={'番表'}>
        <FanTable/>
      </Tabs.Tab>
      <Tabs.Tab label={'日志'}>
        <div className={'markdown-body'}>
          <Update/>
        </div>
      </Tabs.Tab>
    </Tabs>
  );
};