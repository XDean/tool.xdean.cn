import clsx from 'clsx';
import React from 'react';
import {VscChromeClose, VscInfo} from 'react-icons/vsc';
import {useProperty} from '../../../../common/util/property/react';
import {useAppLayoutContext} from '../context';

export const SwitchPage = () => {
  const ctx = useAppLayoutContext();
  const [openInfo, setOpenInfo] = useProperty(ctx.openInfo);
  return (
    <div className={clsx('cursor-pointer rounded-full p-1 select-none',
      openInfo ? 'bg-gray-800 text-white hover:bg-gray-600' : 'hover:bg-gray-600 hover:text-white transition')}
         onClick={() => setOpenInfo(o => !o)}>
      {openInfo ? <VscChromeClose size={24}/> : <VscInfo size={24}/>}
    </div>
  );
};