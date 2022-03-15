import clsx from 'clsx';
import {Image} from 'common/components/Image';
import {GetStaticProps} from 'next';
import Link from 'next/link';
import {ToolMeta} from '../src/lib/meta';
import {getAllToolMetas} from '../src/lib/service';

type Props = {
  data: ToolMeta[]
}

const Page = (props: Props) => {
  const {data} = props;
  return (
    <div className={'m-2 md:m-8 flex flex-row flex-wrap items-center'}>
      {data.map(meta => (
        <Link key={meta.name} href={`/tool/${meta.link}`}>
          <div className={clsx(
            'inline-flex flex-col items-center p-2 group',
            'cursor-pointer rounded border w-40 h-40 md:w-48 md:h-48 text-center m-1 md:m-2',
            'transition transform hover:-translate-y-1 hover:ring hover:shadow')}>
            <div className={'overflow-hidden rounded-full'}>
              <Image src={meta.icon} className={'w-28 md:w-36'} loading={'eager'}/>
            </div>
            <div className={'text-xl md:text-2xl group-hover:underline'}>
              {meta.name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Page;


export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getAllToolMetas();
  return {
    props: {
      data,
    },
  };
};