import {GetStaticProps} from 'next';
import {getAllToolMetas} from '../lib/service';
import {ToolMeta} from '../lib/meta';
import Link from 'next/link';
import {Image} from 'common/components/Image';

type Props = {
  data: ToolMeta[]
}

const Page = (props: Props) => {
  const {data} = props;
  return (
    <div className={'m-8'}>
      {data.map(meta => (
        <Link key={meta.name} href={`/tool/${meta.link}`}>
          <div
            className={
              'w-72 h-48 border rounded-xl m-4 p-2 inline-flex flex-col items-center justify-center ' +
              'group cursor-pointer transition ' +
              'transform hover:-translate-y-1 hover:ring hover:shadow-lg'
            }
          >
            <Image src={meta.icon} width={'40%'}/>
            <div className={'text-2xl mt-4 group-hover:underline'}>
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