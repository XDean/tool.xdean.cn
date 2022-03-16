import clsx from 'clsx';
import { Char, CharMatch, MatchType } from '../domain';
import { normalizeYunMu } from '../util';
import { YinDiaoView } from './YinDiao';

type Props = {
  char: Char
  match?: CharMatch
}

export const CharView = (props: Props) => {
  const {char: {value, shengMu, yunMu, yinDiao, yinDiaoPos}, match} = props;
  return (
    <div className={clsx('flex flex-col items-center justify-center w-16 h-16 lg:h-20 lg:w-20 border-2 leading-0',
      match?.value === 'exact' ? 'bg-teal-500 !text-white' : 'bg-white text-black')}>
      <div className={'flex flex-row items-center justify-center font-mono text-lg'}>
        <div className={'flex flex-col'}>
          <div className={'-mb-2 invisible w-0'}>
            <YinDiaoView value={yinDiao}/>
          </div>
          <div style={{color: getColor(match?.value, match?.shengMu)}}>
            {shengMu}
          </div>
        </div>
        <div className={'flex flex-col'}>
          <div className={'-mb-2'} style={{
            color: getColor(match?.value, match?.yinDiao),
            marginLeft: yinDiaoPos * 10,
          }}>
            <YinDiaoView value={yinDiao}/>
          </div>
          <div style={{color: getColor(match?.value, match?.yunMu)}}>
            {normalizeYunMu(yunMu, yinDiaoPos)}
          </div>
        </div>
      </div>
      <div className={'text-3xl leading-1em font-serif'} style={{color: getColor(match?.value, match?.value)}}>
        {value}
      </div>
    </div>
  );
};


export const MatchColor: Record<MatchType, string> = {
  exact: '#14b8a6',
  fussy: '#de7525',
  none: '#aaaaaa',
};

export function getColor(valueMatch?: MatchType, t?: MatchType) {
  if (!!valueMatch && !!t) {
    if (valueMatch === 'exact') {
      return '#ffffff';
    } else {
      return MatchColor[t];
    }
  } else {
    return undefined;
  }
}