import Image from 'next/image';
import logo from '../../../public/tool/guobiao/logo_512.webp';
import { Tool } from '../index';
import { GuoBiaoMainView } from './components/Main';

export const GuoBiao: Tool = {
  id: 'guobiao',
  name: '国标麻将算番器',
  icon: () => <Image src={logo} layout={'responsive'} className={'rounded-full'}/>,
  content: GuoBiaoMainView,
};