import dynamic from 'next/dynamic';
import Image from 'next/image';
import logo from 'public/tool/handle/favicon.svg';
import { FunctionComponent } from 'react';
import { Tool } from '../index';

const HandleMain = dynamic(() => import('./components/Main').then<FunctionComponent>(e => e.HandleMain));
const Info = dynamic(() => import('./help.mdx'));

export const Handle: Tool = {
  id: 'handle',
  name: '汉兜',
  disableLayout: true,
  icon: () => <Image src={logo} layout={'responsive'}/>,
  content: HandleMain,
  details: Info,
};