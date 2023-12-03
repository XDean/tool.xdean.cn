import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import logo from './icon.jpg';
import { Tool } from '../index';

const Index = dynamic(() => import('./Home').then<FunctionComponent>(e => e.Home));

export const WebglShader: Tool = {
  id: 'webgl-shader',
  name: 'Webgl Shader',
  nameSize: 18,
  icon: () => <Image src={logo} layout={'responsive'} className={'rounded-full'}/>,
  content: Index,
};