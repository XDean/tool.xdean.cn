import {ComponentType} from 'react';
import {FairDice} from './fair_dice';
import {GuoBiao} from './guobiao';
import {Handle} from './handle';
import {Tax} from './tax';
import {DefenceBall} from './defence_ball';

export type Tool = {
  id: string
  name: string
  disableLayout?: boolean
  icon: ComponentType
  details?: ComponentType
  content: ComponentType
}

export const tools: Tool[] = [
  Tax,
  GuoBiao,
  FairDice,
  Handle,
  DefenceBall,
];