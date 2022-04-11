import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import logo from '../../../public/tool/guobiao/logo_512.webp';
import { Tool } from '../index';

const Index = dynamic(() => import('./components').then<FunctionComponent>(e => e.Index));

export const GuoBiao: Tool = {
  id: 'guobiao',
  name: '国标麻将算番器',
  icon: () => <Image src={logo} layout={'responsive'} className={'rounded-full'}/>,
  content: Index,
  disableLayout: true,
};