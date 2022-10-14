import React, {createContext, ReactNode, useContext} from 'react';
import {prop} from '../../../common/util/property/util';
import {mergeDestructor} from '../../../common/util/react';
import {Tool} from '../../tools';
import {SwitchPage} from './components/SwitchPage';

export class AppLayoutContext {
  readonly openInfo = prop(true);
  readonly header = {
    show: prop(true),
    left: prop<ReactNode>(null),
    center: prop<ReactNode>(null),
    right: prop<ReactNode>(null),
  } as const;

  constructor(
    readonly meta: Tool,
  ) {
    this.reset();
  }

  reset = () => mergeDestructor(
    this.header.show.update(true),
    this.header.left.update(<SwitchPage/>),
    this.header.center.update(
      <div className={'text-2xl text-center'}>
        {this.meta.name}
      </div>,
    ),
    this.header.right.update(null),
  );
}

export const AppLayoutReactContext = createContext<AppLayoutContext>(null as any);

export function useAppLayoutContext() {
  return useContext(AppLayoutReactContext);
}
