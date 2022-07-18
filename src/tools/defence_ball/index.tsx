import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import logo from '../../../public/tool/defence_ball/logo.svg';
import { Tool } from '../index';

const Main = dynamic(() => import('./components/index').then<FunctionComponent>(e => e.DefenceBall));

export const DefenceBall: Tool = {
  id: 'defence-ball',
  name: '防守球游戏',
  icon: () => <Image src={logo} layout={'responsive'}/>,
  content: Main,
  disableLayout: true,
};