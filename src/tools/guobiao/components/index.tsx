import { useEffect, VFC } from 'react';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { GuoBiaoMainView } from './Main';
import { IconButton } from '../../../../common/components/icon/IconButton';
import { BiArrowBack, BiBookAlt, BiHelpCircle } from 'react-icons/bi';
import { Info } from './Info';
import { FanTable } from './FanTable';
import { useLocalStorage } from '@mantine/hooks';

const modes = ['main', 'info', 'fan'] as const;
type Mode = typeof modes[number]

export const Index: VFC = () => {
  const [mode, setMode] = useLocalStorage<Mode>({
    key: 'guobiao:mode',
    defaultValue: 'info',
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    window.scrollTo({top: 0});
  }, [mode]);

  return (
    <ToolLayout nav={{
      title: '国标麻将算番器',
      left: mode === 'main' ? (
        <div className={'flex space-x-1 items-center'}>
          <IconButton onClick={() => setMode('info')}>
            <BiHelpCircle size={24}/>
          </IconButton>
          <div onClick={() => setMode('info')}>
            关于
          </div>
        </div>
      ) : (
        <div className={'flex space-x-1 items-center'}>
          <IconButton onClick={() => setMode('main')}>
            <BiArrowBack size={24}/>
          </IconButton>
          <div onClick={() => setMode('main')}>
            返回
          </div>
        </div>
      ),
      right: mode !== 'fan' ? (
        <div className={'flex space-x-1 items-center'}>
          <div onClick={() => setMode('fan')}>
            番表
          </div>
          <IconButton onClick={() => setMode('fan')}>
            <BiBookAlt size={24}/>
          </IconButton>
        </div>
      ) : null,
    }}>
      <div className={mode === 'main' ? 'block' : 'hidden'}>
        <GuoBiaoMainView/>
      </div>
      <div className={mode === 'info' ? 'block' : 'hidden'}>
        <Info/>
      </div>
      <div className={mode === 'fan' ? 'block' : 'hidden'}>
        <FanTable/>
      </div>
    </ToolLayout>
  );
};