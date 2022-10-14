import clsx from 'clsx';
import {FC} from 'react';
import {useObservable} from '../../../../common/util/property/react';
import {useAppLayoutContext} from '../context';

export const Header: FC = () => {
  const ctx = useAppLayoutContext();
  const left = useObservable(ctx.header.left);
  const center = useObservable(ctx.header.center);
  const right = useObservable(ctx.header.right);
  return (
    <header
      className={clsx(
        'sticky top-0 w-full flex flex-row items-center justify-center border-b bg-white z-40 p-1',
      )}
    >
      <div className={'absolute left-2'}>
        {left}
      </div>
      <div className={''}>
        {center}
      </div>
      <div className={'absolute right-2'}>
        {right}
      </div>
    </header>
  );
};
