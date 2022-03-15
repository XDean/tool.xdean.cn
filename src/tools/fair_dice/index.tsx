import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import logo from '../../../public/tool/fair_dice/logo_512.webp';
import { Tool } from '../index';

const Main = dynamic(() => import('./components/Main').then<FunctionComponent>(e => e.Main));

export const FairDice: Tool = {
  id: 'fair-dice',
  name: '公平的骰子',
  icon: () => <Image src={logo} layout={'responsive'}/>,
  content: Main,
};