import { useState, VFC } from 'react';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { GuoBiaoMainView } from './Main';
import { IconButton } from '../../../../common/components/icon/IconButton';
import { BiArrowBack, BiBookAlt, BiHelpCircle } from 'react-icons/bi';
import { Info } from './Info';
import { FanTable } from './FanTable';

const modes = ['main', 'info', 'fan'] as const;
type Mode = typeof modes[number]

export const Index: VFC = () => {
  const [mode, setMode] = useState<Mode>('main');
  return (
    <ToolLayout nav={{
      title: '国标麻将算番器',
      left: mode === 'main' ? (
        <div className={'flex space-x-1 items-center'}>
          <IconButton onClick={() => setMode('info')}>
            <BiHelpCircle size={24}/>
          </IconButton>
          关于
        </div>
      ) : (
        <div className={'flex space-x-1 items-center'}>
          <IconButton onClick={() => setMode('main')}>
            <BiArrowBack size={24}/>
          </IconButton>
          <div>
            返回
          </div>
        </div>
      ),
      right: mode === 'main' ? (
        <div className={'flex space-x-1 items-center'}>
          番表
          <IconButton onClick={() => setMode('fan')}>
            <BiBookAlt size={24}/>
          </IconButton>
        </div>
      ) : null,
    }}>
      <div className={mode === 'main' ? 'block' : 'hidden'}>
        <GuoBiaoMainView/>
      </div>
      {mode === 'info' && <Info/>}
      {mode === 'fan' && <FanTable/>}
    </ToolLayout>
  );
};