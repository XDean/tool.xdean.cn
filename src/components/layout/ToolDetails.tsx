import xdeanLogo from 'common/resources/logo.ico';
import Image from 'next/image';
import React from 'react';
import { VscGithub, VscHome } from 'react-icons/vsc';
import { Comment } from '../../../common/components/badge/Comment';
import { LikeWithAPI } from '../../../common/components/badge/Like';
import { ReadWithAPI } from '../../../common/components/badge/Read';
import { LinkIcon } from '../../../common/components/icon/LinkIcon';
import { Tool } from '../../tools';
import { GithubComment } from '../util/GithubComment';

type Props = {
  meta: Tool
}
export const ToolDetails = (props: Props) => {
  const {meta} = props;
  return (
    <div className={'flex flex-col items-center space-y-4'}>
      <div className={'flex flex-row !space-x-4'}>
        <LinkIcon href={'/'}
                  icon={<VscHome size={40}
                                 className={'border-2 border-black rounded-full hover:rotate-[360deg] transition duration-[1s]'}/>}/>
        <LinkIcon href={`https://github.com/XDean/tool.xdean.cn/blob/main/tools/${meta.id}`}
                  icon={<VscGithub size={40}
                                   className={'rounded-full hover:rotate-[360deg] transition duration-[1s]'}/>}
                  target={'_blank'}/>
        <LinkIcon href={'https://xdean.cn'}
                  icon={(
                    <div
                      className={'block border-2 border-black rounded-full w-[40px] h-[40px] hover:rotate-[360deg] transition duration-[1s]'}>
                      <Image src={xdeanLogo} width={40} height={40}/>
                    </div>
                  )}/>
      </div>
      <div className={'space-x-2'}>
        <ReadWithAPI id={`tool:${meta.id}`} name={'访问'}/>
        <LikeWithAPI id={`tool:${meta.id}`}/>
        <Comment/>
      </div>
      {meta.details && <meta.details/>}
      <hr className={'w-full !mt-6'}/>
      <div className={'w-full'}>
        <GithubComment/>
      </div>
    </div>
  );
};