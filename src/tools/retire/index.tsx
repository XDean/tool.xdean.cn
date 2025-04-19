import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import logo from '../../../public/tool/retire/logo.webp';
import { Tool } from '../index';

const Index = dynamic(() => import('./components/RetireView').then<FunctionComponent>(e => e.RetireView));

export const Retire: Tool = {
  id: 'retire',
  name: '退休计算器',
  icon: () => <Image src={logo} layout={'responsive'} className={'rounded-full'}/>,
  content: Index,
  disableLayout: true,
};