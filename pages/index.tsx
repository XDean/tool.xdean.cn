import clsx from 'clsx';
import Link from 'next/link';
import { tools } from '../src/tools';

const Page = () => {
  return (
    <div className={'m-2 md:m-8 flex flex-row flex-wrap items-center'}>
      {tools.map(meta => (
        <Link key={meta.name} href={`/tool/${meta.id}`}>
          <a className={clsx(
            'w-[160px] h-[160px] group cursor-pointer rounded border text-center m-2 p-2',
            'transition transform hover:-translate-y-1 hover:ring hover:shadow')}>
            <div className={'overflow-hidden w-[110px] h-[110px] relative mx-auto'}>
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
  );
};

export default Page;