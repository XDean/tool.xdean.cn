import clsx from 'clsx';
import React, { PropsWithChildren, useState } from 'react';
import { VscChromeClose, VscInfo } from 'react-icons/vsc';
import { Footer } from '../../common/components/Footer';
import { ToolMeta } from '../../lib/meta';
import { ToolDetails } from './ToolDetails';

type Props = PropsWithChildren<{
  meta: ToolMeta
}>

export const ToolLayout = (props: Props) => {
  const {children, meta} = props;
  const [open, setOpen] = useState(false);
  return (
    <div className={'w-full max-w-screen-md min-h-screen mx-auto relative flex flex-col px-2'}>
      <nav className={'sticky top-0 w-full border-b bg-white z-40 p-1 flex flex-row items-center justify-center space-x-2'}>
        <div className={clsx('absolute left-2 cursor-pointer rounded-full p-1 select-none',
          open ? 'bg-gray-800 text-white hover:bg-gray-600' : 'hover:bg-gray-600 hover:text-white transition')}
             onClick={() => setOpen(o => !o)}>
          {open ? <VscChromeClose size={24}/> : <VscInfo size={24}/>}
        </div>
        <div className={'text-2xl text-center'}>
          {meta.name}
        </div>
      </nav>
      <main className={'mt-4 container mx-auto flex-grow'}>
        <div className={open ? 'hidden' : 'block'}>
          {children}
        </div>
        <div className={open ? 'block' : 'hidden'}>
          <ToolDetails meta={meta}/>
        </div>
      </main>
      <Footer/>
    </div>
  );
};