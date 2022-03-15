import Image from 'next/image';
import logo from 'public/tool/handle/favicon.svg';
import { Tool } from '../index';
import Info from './Info.mdx';
import { HandleMain } from './Main';

export const Handle: Tool = {
  id: 'handle',
  name: '汉兜',
  icon: () => <Image src={logo} layout={'responsive'}/>,
  content: HandleMain,
  details: Info,
};