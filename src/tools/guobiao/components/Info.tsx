import Help from './help.mdx';
import { LinkIcon } from '../../../../common/components/icon/LinkIcon';
import { VscGithub, VscHome } from 'react-icons/vsc';
import Image from 'next/image';
import xdeanLogo from '../../../../common/resources/logo.ico';
import { ReadWithAPI } from '../../../../common/components/badge/Read';
import { LikeWithAPI } from '../../../../common/components/badge/Like';
import { Comment } from '../../../../common/components/badge/Comment';
import React, { useRef } from 'react';
import { GuoBiao } from '../index';
import { GithubComment } from '../../../components/util/GithubComment';

export const Info = () => {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={'flex flex-col items-center space-y-4'}>
      <div className={'flex flex-row !space-x-4'}>
        <LinkIcon href={'/'}
                  icon={<VscHome size={40}
                                 className={'border-2 border-black rounded-full hover:rotate-[360deg] transition duration-[1s]'}/>}/>
        <LinkIcon href={`https://github.com/XDean/tool.xdean.cn/blob/main/tools/${GuoBiao.id}`}
                  icon={<VscGithub size={40}
                                   className={'rounded-full hover:rotate-[360deg] transition duration-[1s]'}/>}
                  target={'_blank'}/>
        <LinkIcon href={'https://xdean.cn'}
                  icon={(
                    <div
                      className={'block border-2 border-black rounded-full w-[40px] h-[40px] hover:rotate-[360deg] transition duration-[1s]'}>
                      <Image src={xdeanLogo} width={40} height={40} alt={'XDean'}/>
                    </div>
                  )}/>
      </div>
      <div className={'space-x-2'}>
        <ReadWithAPI id={`tool:${GuoBiao.id}`} name={'访问'}/>
        <LikeWithAPI id={`tool:${GuoBiao.id}`}/>
        <Comment onGotoComment={() => commentRef.current && commentRef.current.scrollIntoView()}/>
      </div>
      <div className={'markdown-body'}>
        <Help/>
      </div>
      <div className={'w-full'} ref={commentRef}>
        <GithubComment/>
      </div>
    </div>
  );
};