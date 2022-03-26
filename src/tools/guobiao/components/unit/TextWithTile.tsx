import {HTMLAttributes, useMemo} from 'react';
import {TilesView} from './Tiles';
import {Tiles} from '../../core/type';
import clsx from 'clsx';

type Props = {
  text: string
} & HTMLAttributes<HTMLDivElement>
export const TextWithTile = (props: Props) => {
  const {text, ...rest} = props;
  const parts = useMemo(() => text
    .split(/[\[\]]/)
    .map((e, i) => {
      console.log(e, i);
      const idx = text.indexOf(e);
      if (idx > 0 && text.charAt(idx - 1) === '[') {
        return <TilesView tiles={Tiles.from(e).tiles} key={i} scale={0.5}/>;
      } else {
        return e;
      }
    }), [text]);

  return (
    <div {...rest} className={clsx(rest.className, 'flex flex-row flex-wrap items-end')}>
      {parts}
    </div>
  );
};