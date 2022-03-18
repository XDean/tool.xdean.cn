import pinyin from 'pinyin';
import { MatchType, ParsedChar, ParsedWord, WordMatch, YinDiao } from './domain';

export function getWordPinYin(value: string): ParsedChar[] {
  return value.split('').map(getCharPinYin);
}

export function getCharPinYin(value: string): ParsedChar {
  const char = value[0];
  const py = pinyin(char, {style: pinyin.STYLE_TO3NE})[0][0];
  let shengMu = pinyin(char, {style: pinyin.STYLE_INITIALS})[0][0];
  if (shengMu.length === 0) {
    switch (py[0]) {
      case 'y':
      case 'w':
        shengMu = py[0];
        break;
    }
  }
  const yunMuWithShengDiao = py.slice(shengMu.length);
  const split = yunMuWithShengDiao.split(/\d/);
  const yinDiao = (split.length === 2 ? Number(yunMuWithShengDiao.charAt(split[0].length)) : 0) as YinDiao;
  const yinDiaoPos = split.length === 2 ? split[0].length - 1 : -1;
  return {
    value: char,
    shengMu,
    yunMu: split.join(''),
    yinDiao,
    yinDiaoPos,
  };
}

export function matchWord(value: ParsedWord, target: ParsedWord): WordMatch {
  const valueMatch = match(value.map(e => e.value), target.map(e => e.value));
  const shengMuMatch = match(value.map(e => e.shengMu), target.map(e => e.shengMu));
  const yunMuMatch = match(value.map(e => e.yunMu), target.map(e => e.yunMu));
  const yinDiaoMatch = match(value.map(e => e.yinDiao), target.map(e => e.yinDiao));
  return value.map((_, i) => ({
    value: valueMatch[i],
    shengMu: shengMuMatch[i],
    yunMu: yunMuMatch[i],
    yinDiao: yinDiaoMatch[i],
  }));
}

export function match<T>(value: T[], target: T[]): MatchType[] {
  const used: boolean[] = value.map(() => false);
  const res: MatchType[] = value.map(() => 'none');
  for (let i = 0; i < value.length; i++) {
    if (value[i] === target[i]) {
      res[i] = 'exact';
      used[i] = true;
    }
  }
  for (let i = 0; i < value.length; i++) {
    if (res[i] !== 'exact') {
      let idx = -1;
      while (true) {
        idx = target.indexOf(value[i], idx + 1);
        if (idx === -1) {
          break;
        } else {
          if (!used[idx]) {
            used[idx] = true;
            res[i] = 'fussy';
          }
        }
      }
    }
  }
  return res;
}

export function normalizeYunMu(yunMu: string, yinDiaoPos: number) {
  if (yinDiaoPos >= 0 && yunMu.charAt(yinDiaoPos) === 'i') {
    yunMu = yunMu.replace('i', 'ı');
  }
  return yunMu;
}

export const MatchColor: Record<MatchType, string> = {
  exact: '#14b8a6',
  fussy: '#de7525',
  none: '#aaaaaa',
};

export function getMatchColor(t?: MatchType, valueMatch?: MatchType) {
  if (t === undefined) {
    return undefined;
  } else if (valueMatch === 'exact') {
    return '#ffffff';
  } else {
    return MatchColor[t];
  }
}

export function filter4ChineseChar(input: string) {
  return Array.from(input).filter(i => /\p{Script=Han}/u.test(i)).slice(0, 4).join('');
}