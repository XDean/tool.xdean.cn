import React, {PropsWithChildren} from 'react';
import {ToolMeta} from '../../lib/meta';
import {GithubComment} from '../util/GithubComment';
import {CONSTANT} from '../../lib/constants';
import {Footer} from '../../common/components/Footer';
import {XDeanIcon} from '../../common/components/icon/XDeanIcon';
import {GithubIcon} from '../../common/components/icon/GithubIcon';
import {TiArrowBack} from 'react-icons/ti';
import {Icon} from '../../common/components/icon/Icon';

type Props = PropsWithChildren<{
  meta: ToolMeta
}>

export const ToolLayout = (props: Props) => {
  const {children, meta} = props;
  return (
    <div className={'w-full'}>
      <nav className={'sticky top-0 z-40'}>
        <div className={'w-full shadow-md border-b bg-white z-40 p-1 md:p-2 flex flex-row items-center space-x-2'}>
          <Icon alt={'Home'}
                icon={width => <TiArrowBack style={{width, height: width}}/>}
                rounded
                link={'/'}
                ring
                linkTarget={'_self'}
          />
          <div className={'text-2xl md:text-4xl text-center flex-grow'}>
            {meta.name}
          </div>
          <XDeanIcon/>
          <GithubIcon repo={CONSTANT.repo} codePath={`/tools/${meta.id}`}/>
        </div>
      </nav>
      <main className={'mt-4 container mx-auto min-h-[calc(100vh-150px)]'}>
        {children}
        <hr className={'mt-4'}/>
        <GithubComment/>
      </main>
      <Footer className={'w-10/12 mt-4 mb-8 mx-auto'}/>
    </div>
  );
};