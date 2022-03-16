import clsx from 'clsx';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { VscGithub } from 'react-icons/vsc';
import { Footer } from '../common/components/Footer';
import { LinkIcon } from '../common/components/icon/LinkIcon';
import xdeanLogo from '../common/resources/logo.ico';
import { tools } from '../src/tools';

const Page = () => {
  return (
    <div className={'w-full max-w-screen-md min-h-screen mx-auto relative flex flex-col px-2'}>
      <Head>
        <title>XDean的百宝箱</title>
      </Head>
      <main className={'flex-grow'}>
        <div className={'flex flex-col items-center space-y-4'}>
          <div className={'text-3xl lg:text-5xl mt-8 text-center'}>
            XDean的百宝箱
          </div>
          <div className={'space-x-4 flex'}>
            <LinkIcon href={`https://github.com/XDean/tool.xdean.cn`}
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
        </div>
        <div className={'m-2 md:m-8 flex flex-row flex-wrap items-center justify-center'}>
          {tools.map(meta => (
            <Link key={meta.name} href={`/tool/${meta.id}`}>
              <a className={clsx(
                'w-[150px] h-[150px] group cursor-pointer rounded border text-center m-2 p-2',
                'transition transform hover:-translate-y-1 hover:ring hover:shadow')}>
                <div className={'overflow-hidden w-[100px] h-[100px] relative mx-auto'}>
                  <meta.icon/>
                </div>
                <div className={'group-hover:underline leading-[40px] whitespace-nowrap text-ellipsis overflow-hidden'}
                     style={{fontSize: `${Math.min(30, 130 / meta.name.length)}px`}}>
                  {meta.name}
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
      <Footer className={'mx-4'}/>
    </div>
  );
};

export default Page;