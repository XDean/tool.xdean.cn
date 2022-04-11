import { Footer } from 'common/components/Footer';
import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  nav: {
    title: string
    left?: ReactNode
    right?: ReactNode
  }
}

export const ToolLayout: FC<Props> = (props) => {
  return (
    <div className={'w-full max-w-screen-md min-h-screen mx-auto relative flex flex-col lg:px-2'}>
      <nav
        className={'sticky top-0 w-full border-b bg-white z-40 p-1 flex flex-row items-center justify-center space-x-2'}>
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
      <Footer/>
    </div>
  );
};