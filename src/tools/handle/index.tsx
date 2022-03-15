import dynamic from 'next/dynamic';
import Image from 'next/image';
import logo from 'public/tool/handle/favicon.svg';
import { FunctionComponent } from 'react';
import { Tool } from '../index';

const HandleMain = dynamic(() => import('./Main').then<FunctionComponent>(e => e.HandleMain));
const Info = dynamic(() => import('./Info.mdx'));

export const Handle: Tool = {
  id: 'handle',
  name: '汉兜',
  icon: () => <Image src={logo} layout={'responsive'}/>,
  content: HandleMain,
  details: Info,
};