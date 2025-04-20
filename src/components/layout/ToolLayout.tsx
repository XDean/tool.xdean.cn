import { Footer } from 'common/components/Footer';
import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { Ads } from '../Ads';

type Props = {
  nav: {
    title: string
    left?: ReactNode
    right?: ReactNode
  }
  ads?: boolean
}

export const ToolLayout: FC<Props> = (props) => {
  return (
    <div className={'mt-10 overflow-auto sb-lite'}>
      <div
        className={'w-full max-w-screen-md h-[calc(100vh-2.5rem)] mx-auto relative flex flex-col lg:px-2'}>
        <nav
          className={'w-full border-b fixed top-0 left-0 h-10 bg-white z-40 p-1 flex flex-row items-center justify-center space-x-2'}>
          <div className={clsx('absolute left-2')}>
            {props.nav.left}
          </div>
          <div className={'text-2xl text-center'}>
            {props.nav.title}
          </div>
          <div className={clsx('absolute right-2')}>
            {props.nav.right}
          </div>
        </nav>
        <main className={'my-4 container mx-auto flex-grow px-2'}>
          {props.children}
        </main>
        {(props.ads ?? true) && <Ads/>}
        <Footer/>
      </div>
    </div>
  );
};