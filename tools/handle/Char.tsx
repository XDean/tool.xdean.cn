import { Char } from './domain';
import { YinDiaoView } from './YinDiao';

type Props = {
  char: Char
}

export const CharView = (props: Props) => {
  const {char: {value, shengMu, yunMu, yinDiao}} = props;
  return (
    <div className={'flex flex-col items-center justify-center h-20 w-20 border-2 leading-0'}>
      <div className={'flex flex-row items-center justify-center font-mono'}>
        <div className={'flex flex-col'}>
          <div className={'-mb-2 invisible'}>
            <YinDiaoView value={yinDiao}/>
          </div>
          {shengMu}
        </div>
        <div className={'flex flex-col'}>
          <div className={'-mb-2'}>
            <YinDiaoView value={yinDiao}/>
          </div>
          <div>
            {yunMu}
          </div>
        </div>
      </div>
      <div className={'text-3xl leading-1em font-serif'}>
        {value}
      </div>
    </div>
  );
};