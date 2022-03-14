import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { VscMenu } from 'react-icons/vsc';
import { Footer } from '../../common/components/Footer';
import { ToolMeta } from '../../lib/meta';

type Props = PropsWithChildren<{
  meta: ToolMeta
}>

export const ToolLayout = (props: Props) => {
  const {children, meta} = props;
  return (
    <div className={'w-full max-w-screen-md min-h-screen mx-auto relative flex flex-col px-2'}>
      <nav className={'w-full border-b bg-white z-40 p-1 md:p-2 flex flex-row items-center space-x-2'}>
        <div className={clsx('absolute cursor-pointer rounded-full p-2',
          'hover:bg-gray-600 hover:text-white transition')}>
          <VscMenu size={24}/>
        </div>
        <div className={'text-2xl md:text-4xl text-center flex-grow'}>
          {meta.name}
        </div>
      </nav>
      <main className={'mt-4 container mx-auto flex-grow'}>
        {children}
      </main>
      <Footer/>
    </div>
  );
};