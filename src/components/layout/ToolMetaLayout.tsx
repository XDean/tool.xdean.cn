import React, {PropsWithChildren, useMemo} from 'react';
import {Footer} from '../../../common/components/Footer';
import {useObservable} from '../../../common/util/property/react';
import {Tool} from '../../tools';
import {Header} from './components/Header';
import {AppLayoutContext, AppLayoutReactContext} from './context';
import {ToolDetails} from './ToolDetails';
import { Ads } from '../Ads';

type Props = PropsWithChildren<{
  meta: Tool
}>

export const ToolMetaLayout = (props: Props) => {
  const {children, meta} = props;
  const context = useMemo(() => new AppLayoutContext(meta), [meta]);
  const showHeader = useObservable(context.header.show);
  const openInfo = useObservable(context.openInfo);
  return (
    <AppLayoutReactContext.Provider value={context}>
      <div className={'w-full max-w-screen-md min-h-screen mx-auto relative flex flex-col px-2'}>
        {showHeader && <Header/>}
        <main className={'my-4 container mx-auto flex-grow'}>
          <div className={openInfo ? 'hidden' : 'block'}>
            {children}
          </div>
          <div className={openInfo ? 'block' : 'hidden'}>
            <ToolDetails meta={meta}/>
          </div>
        </main>
        <Ads/>
        <Footer/>
      </div>
    </AppLayoutReactContext.Provider>
  );
};