import {PropsWithChildren} from 'react';
import {ToolMeta} from '../../lib/meta';
import {DefaultLayout} from './DefaultLayout';
import {GithubComment} from '../util/GithubComment';

type Props = PropsWithChildren<{
  meta: ToolMeta
}>

export const ToolLayout = (props: Props) => {
  const {children, meta} = props;
  return (
    <DefaultLayout meta={meta}>
      {children}
      <hr className={'mt-4'}/>
      <GithubComment/>
    </DefaultLayout>
  );
};