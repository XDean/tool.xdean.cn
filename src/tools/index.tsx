import { ComponentType } from 'react';
import { FairDice } from './fair_dice';
import { GuoBiao } from './guobiao';
import { Handle } from './handle';
import { Tax } from './tax';

export type Tool = {
  id: string
  name: string
  icon: ComponentType
  draft?: boolean
  details?: ComponentType
  content: ComponentType
}

export const tools: Tool[] = [
  Tax,
  GuoBiao,
  FairDice,
  Handle,
];