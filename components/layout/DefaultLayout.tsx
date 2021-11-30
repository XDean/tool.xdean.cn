import {PropsWithChildren} from 'react';
import {AppBar} from 'common/components/AppBar';
import {Footer} from 'common/components/Footer';
import {CONSTANT} from 'lib/constants';
import {ToolMetaInline} from '../../lib/meta';

type Props = PropsWithChildren<{
  meta?: ToolMetaInline
}>

export const DefaultLayout = (props: Props) => {
  const {children, meta} = props;
  return (
    <div>
      <nav className={'sticky top-0 z-40'}>
        <AppBar icon={''} title={meta?.name || 'XDean的工具箱'} repo={CONSTANT.repo}/>
      </nav>
      <main className={'mt-4 mx-auto w-max'}>
        {children}
      </main>
      <Footer className={'w-10/12 mt-4 mb-8 mx-auto'}/>
    </div>
  );
};