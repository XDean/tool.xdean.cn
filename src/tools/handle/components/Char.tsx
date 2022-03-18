import clsx from 'clsx';
import { CharMatch, ParsedChar } from '../domain';
import { getMatchColor, normalizeYunMu } from '../util';
import { YinDiaoView } from './YinDiao';

type Props = {
  char: ParsedChar
  match?: CharMatch
}

export const CharView = (props: Props) => {
  const {char: {value, shengMu, yunMu, yinDiao, yinDiaoPos}, match} = props;
  return (
    <div className={clsx('flex flex-col items-center justify-center w-16 h-16 lg:h-20 lg:w-20 border-2 leading-0',
      match?.value === 'exact' ? 'bg-teal-500 !text-white' : 'bg-white text-black')}>
      <div className={'flex flex-row items-center justify-center font-mono text-md lg:text-lg -mb-1'}>
        <div className={'flex flex-col'}>
          <div className={'-mb-2 invisible w-0'}>
            <YinDiaoView value={yinDiao}/>
          </div>
          <div style={{color: match && getMatchColor(match.shengMu, match.value)}}>
            {shengMu}
          </div>
        </div>
        <div className={'flex flex-col'}>
          <div className={'-mb-2'} style={{
            color: match && getMatchColor(match.yinDiao, match.value),
            marginLeft: yinDiaoPos * 10,
          }}>
            <YinDiaoView value={yinDiao}/>
          </div>
          <div style={{color: match && getMatchColor(match.yunMu, match.value)}}>
            {normalizeYunMu(yunMu, yinDiaoPos)}
          </div>
        </div>
      </div>
      <div className={'text-2xl lg:text-3xl leading-1em font-serif'}
           style={{color: match && getMatchColor(match.value, match.value)}}>
        {value}
      </div>
    </div>
  );
};


