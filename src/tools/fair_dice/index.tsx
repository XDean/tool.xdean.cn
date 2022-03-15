import Image from 'next/image';
import logo from '../../../public/tool/fair_dice/logo_512.webp';
import { Tool } from '../index';
import { Main } from './components/Main';

export const FairDice: Tool = {
  id: 'fair-dice',
  name: '公平的骰子',
  icon: () => <Image src={logo} layout={'responsive'}/>,
  content: Main,
};