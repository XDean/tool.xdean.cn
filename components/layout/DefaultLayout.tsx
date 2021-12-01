import {PropsWithChildren} from 'react';
import {AppBar} from 'common/components/AppBar';
import {Footer} from 'common/components/Footer';
import {CONSTANT} from 'lib/constants';

type Props = PropsWithChildren<{}>

export const DefaultLayout = (props: Props) => {
  const {children} = props;
  return (
    <div className={'w-full'}>
      <nav className={'sticky top-0 z-40'}>
        <AppBar icon={''} title={'XDean的工具箱'} repo={CONSTANT.repo}/>
      </nav>
      <main className={'mt-4 max-w-full'}>
        {children}
      </main>
      <Footer className={'w-10/12 mt-4 mb-8 mx-auto'}/>
    </div>
  );
};