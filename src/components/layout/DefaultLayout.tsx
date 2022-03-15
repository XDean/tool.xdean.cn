import {Footer} from 'common/components/Footer';
import {CONSTANT} from 'src/lib/constants';
import React, {PropsWithChildren} from 'react';
import {GithubIcon} from '../../../common/components/icon/GithubIcon';
import {XDeanIcon} from '../../../common/components/icon/XDeanIcon';

type Props = PropsWithChildren<{}>

export const DefaultLayout = (props: Props) => {
  const {children} = props;
  return (
    <div className={'min-h-screen flex flex-col'}>
      <nav className={'sticky z-40 top-0'}>
        <div className={'flex flex-row items-center shadow bg-white px-1 md:p-2 whitespace-nowrap overflow-hidden'}>
          <span className={'text-2xl md:text-3xl'}>
            XDean的工具箱
          </span>
          <div className={'ml-auto space-x-2 flex flex-row items-center'}>
            <XDeanIcon/>
            <GithubIcon repo={CONSTANT.repo}/>
          </div>
        </div>
      </nav>
      <main className={'overflow-hidden flex-grow'}>
        {children}
      </main>
      <Footer className={'mx-4'}/>
    </div>
  );
};